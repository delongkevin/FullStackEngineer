# Kamps Smart Factory Platform — Technical Q&A Documentation

**Project:** Kamps Smart Factory Platform  
**Client:** Kamps  
**Slug:** `kamps-smart-factory`  
**Category:** Full Stack  
**Live Demo:** `/projects/kamps-smart-factory/index.html`  
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)  
**Mobile Builds:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/latest)

---

## Overview

The Kamps Smart Factory Platform is an Industry 4.0 full-stack system demonstrating the integration of operational technology (OT) and information technology (IT) across a modern manufacturing environment. The platform bridges Allen-Bradley Modbus TCP PLCs and Siemens S7 OPC-UA controllers to a cloud-native microservices stack, providing real-time pallet detection via YOLOv8/OpenCV/PyTorch at 28 FPS, K3s-orchestrated containerized services, PostgreSQL-backed inventory management, Prometheus/Grafana observability, OpenTelemetry distributed tracing, MQTT pub/sub messaging, OAuth2/JWT authentication, and a full Azure DevOps CI/CD pipeline with 92% test coverage. The mobile dashboard is deployable as an Android APK and iOS TestFlight build.

---

## 1. Architecture & Design Q&A

**Q1. Describe the overall system architecture, particularly the separation between OT (operational technology) and IT (information technology) layers.**

The platform employs a Purdue Model–inspired segmentation with modern cloud-native adaptations. The OT layer encompasses the PLC edge devices (Allen-Bradley CompactLogix for Modbus TCP, Siemens S7-1200 for OPC-UA) and the physical conveyor/vision hardware. An edge gateway layer runs on an industrial PC (IPC) hosting the `plc-bridge` microservice, which translates PLC register reads into normalized MQTT messages published to the factory's internal broker. This gateway layer sits in an OT DMZ (demilitarized zone) with firewall rules permitting only outbound MQTT to the Mosquitto broker in the IT layer — no inbound connections from IT to OT are permitted. The IT layer runs on a K3s cluster (single-node for demo, multi-node for production) hosting all seven containerized microservices: `vision-api`, `plc-bridge`, `api-gateway`, `postgres-16`, `mqtt-broker`, `grafana`, and `prometheus`. The React/TypeScript frontend dashboard communicates exclusively with the `api-gateway`, which enforces OAuth2/JWT authentication before proxying requests to internal services. This segmentation prevents a compromised IT system from directly issuing commands to PLCs.

**Q2. How does the K3s microservices orchestration work, and why was K3s chosen over full Kubernetes or Docker Compose?**

K3s (Lightweight Kubernetes by Rancher/SUSE) was selected as the container orchestrator because it runs on the industrial PC hardware typically deployed in factory edge environments (x86-64 or ARM Cortex-A72, 4–8 GB RAM) — full Kubernetes requires significantly more resources (16+ GB) and is impractical on factory-floor IPCs. K3s includes Traefik as the default ingress controller, SQLite as the default etcd replacement for single-node clusters (swappable to embedded etcd or external PostgreSQL for HA), and a bundled `containerd` runtime. Docker Compose was rejected because it lacks rolling deployment, health-based rollout control, and the `HorizontalPodAutoscaler` capability needed to scale the `vision-api` under peak detection load. Each of the seven microservices is deployed as a Kubernetes `Deployment` with `readinessProbe` and `livenessProbe` configured, ensuring that a crashing `vision-api` pod is automatically restarted without affecting the `api-gateway` or PostgreSQL availability.

**Q3. Describe the MQTT pub/sub messaging architecture used for PLC sensor data distribution.**

The MQTT broker (Eclipse Mosquitto 2.x) acts as the central nervous system of the OT data layer. The `plc-bridge` service publishes sensor readings to structured topics following the Sparkplug B specification: `spBv1.0/{group_id}/DDATA/{edge_node_id}/{device_id}`, where `group_id` maps to the factory zone (e.g., `ZONE_A`), `edge_node_id` identifies the IPC, and `device_id` identifies the specific PLC or sensor. The payload is Protobuf-encoded (Sparkplug B uses Google Protocol Buffers for efficient binary serialization). Subscriber services — `vision-api` for trigger signals, `api-gateway` for forwarding to the WebSocket feed, and `prometheus` via an MQTT exporter — subscribe to topic wildcards matching their data domain. Quality of Service (QoS) 1 (at-least-once) is used for sensor telemetry (occasional duplicate acceptable), and QoS 2 (exactly-once) is used for PLC command acknowledgments to prevent duplicate actuator commands. The broker enforces ACL-based topic authorization: the `plc-bridge` client has publish-only rights; subscriber clients have subscribe-only rights; no client has both, preventing a compromised subscriber from injecting spurious PLC commands.

**Q4. How is the YOLOv8 vision AI integrated into the production pipeline architecture?**

The `vision-api` is a FastAPI (Python) microservice hosting a YOLOv8n (nano) model quantized to INT8 using PyTorch's `torch.ao.quantization` post-training static quantization, achieving 28 FPS on the IPC's CPU (or 60+ FPS with a GPU). The service exposes a WebSocket endpoint (`/ws/detection`) that streams bounding-box results as JSON to subscribers. Frame ingestion is handled by an OpenCV `VideoCapture` thread pulling from an RTSP stream from the overhead IP camera. The detection loop runs in a separate process (Python `multiprocessing` to bypass the GIL) pinned to dedicated CPU cores via `taskset`. Detected pallet events — bounding boxes, confidence scores, class IDs, and timestamps — are published to the MQTT topic `spBv1.0/ZONE_A/DDATA/vision-node-01/pallets` and simultaneously written to PostgreSQL's `detections` table for historical trend queries. The MQTT trigger from the PLC (photoelectric sensor break event) can gate the vision pipeline — the model only runs inference on frames within 500 ms of a sensor trigger, reducing compute load by ~70% during idle periods.

**Q5. How does the OpenTelemetry distributed tracing architecture work across the seven microservices?**

Every microservice is instrumented with the OpenTelemetry SDK (`opentelemetry-sdk` for Python FastAPI services, `opentelemetry-dotnet` for the .NET API gateway). Each inbound HTTP request generates a root span; downstream service calls (HTTP or MQTT publish) propagate the `traceparent` W3C Trace Context header. The `vision-api`'s inference path creates child spans for: frame grab, pre-processing, model inference, post-processing NMS, and MQTT publish — allowing engineers to identify exactly which stage of the pipeline introduces latency regressions. Spans are exported via OTLP gRPC to an OpenTelemetry Collector pod, which fans out to Jaeger for trace visualization and Prometheus for span-derived metrics (via the `spanmetrics` connector). Grafana's Tempo data source connects to Jaeger, enabling trace-drill-down directly from a Grafana panel by clicking on a latency spike in the `vision_inference_duration_seconds` histogram.

**Q6. Describe the PostgreSQL data model for inventory and how it handles real-time pallet detection writes.**

The PostgreSQL 16 schema uses three primary tables: `pallets` (pallet_id UUID PK, sku VARCHAR, location_zone VARCHAR, status ENUM, created_at TIMESTAMPTZ), `detections` (detection_id BIGSERIAL PK, pallet_id UUID FK, bounding_box JSONB, confidence NUMERIC(4,3), frame_ts TIMESTAMPTZ, camera_id SMALLINT), and `plc_events` (event_id BIGSERIAL PK, zone VARCHAR, sensor_id VARCHAR, event_type VARCHAR, raw_value NUMERIC, ts TIMESTAMPTZ). High-frequency detection writes (up to 28 rows/s per camera) use PostgreSQL's `COPY` protocol via `asyncpg` with buffered batch inserts (100 rows per commit, flushed every 500 ms) rather than individual `INSERT` statements, reducing write amplification by 95x. The `detections` table uses a `BRIN` index on `frame_ts` (suitable for append-only time-series data) rather than a `BTREE` index, reducing index maintenance overhead. A `TimescaleDB` extension is recommended for production-scale time-series partitioning (see Full-Scale Adaptation Notes).

**Q7. How does the Azure DevOps CI/CD pipeline achieve a 92% test coverage gate?**

The Azure DevOps pipeline is defined in `azure-pipelines.yml` with six sequential stages: `Lint`, `UnitTest`, `IntegrationTest`, `DockerBuild`, `ScanAndValidate`, and `K3sDeploy`. The `UnitTest` stage runs `pytest` with `pytest-cov` for Python services and `dotnet test` with `coverlet` for the .NET gateway. Coverage reports from all services are merged by `coverage combine` and uploaded to Azure DevOps's built-in coverage reporting. A pipeline gate rejects the build if the merged coverage percentage falls below 92%. The `IntegrationTest` stage spins up a Docker Compose stack (PostgreSQL, Mosquitto, mock PLC simulator) and runs end-to-end API tests using `httpx` and `pytest-asyncio`. The `K3sDeploy` stage performs a rolling update: it patches the K3s `Deployment` image tag and monitors `kubectl rollout status` with a 5-minute timeout — if any pod fails readiness, the pipeline triggers a `kubectl rollout undo` before marking the pipeline as failed.

**Q8. What is the OAuth2/JWT authentication architecture, and how are scoped tokens used to differentiate operator vs. admin access?**

Authentication uses an OAuth2 Authorization Code with PKCE flow against a configurable identity provider (Keycloak in production). The `api-gateway` (.NET) validates JWTs using the identity provider's public JWKS endpoint (`/.well-known/jwks.json`) with RS256 signature verification. Each JWT carries a `roles` claim: `["operator"]` for floor operators (read-only dashboard access, no PLC command writes) and `["operator", "admin"]` for supervisors (full access including PLC setpoint writes and user management). The gateway enforces claims-based authorization via `[Authorize(Policy = "AdminOnly")]` attributes on administrative endpoints. The `vision-api` and `plc-bridge` use service-to-service OAuth2 Client Credentials flow — machine-to-machine tokens with a 1-hour TTL, cached in memory with automatic refresh 5 minutes before expiry. Token introspection is cached in Redis for 30 seconds to avoid per-request identity provider round-trips under high load.

---

## 2. Technology Stack Q&A

**Q1. Why was FastAPI chosen for the vision API and PLC bridge services over Django or Flask?**

FastAPI was chosen for three primary reasons. First, its async-native architecture (built on Starlette and `asyncio`) allows the `vision-api` to handle concurrent WebSocket connections for multiple dashboard clients while simultaneously running the CPU-bound inference loop in a process pool — without blocking the event loop. Second, FastAPI's automatic OpenAPI 3.1 schema generation (via Pydantic model annotations) produces a `swagger.json` consumed by the Azure DevOps pipeline for contract validation against the React TypeScript client's generated types. Third, FastAPI's Pydantic v2 model validation enforces strict type constraints on incoming MQTT payloads before they reach the database layer — malformed PLC messages are rejected with a 422 response before any persistence occurs, preventing data corruption.

**Q2. How does the Allen-Bradley Modbus TCP integration work at the protocol level?**

Allen-Bradley CompactLogix PLCs expose their tag database over Ethernet/IP (ENIP) natively, but the `plc-bridge` uses the Modbus TCP function codes (Read Holding Registers: FC03; Write Single Register: FC06) via a Modbus-over-Ethernet/IP gateway profile configured on the PLC. The Python `pymodbus` library (asyncio flavor) issues register read requests every 100 ms on a configurable polling loop. Register map definitions are stored in a YAML configuration file (`config/allen-bradley-registers.yaml`) mapping register addresses to engineering-unit variable names and scaling factors (e.g., `register: 40001, name: conveyor_speed_rpm, scale: 0.1, unit: rpm`). The `plc-bridge` applies the scaling, packages the result into a Sparkplug B Protobuf payload, and publishes to MQTT. Write operations (setpoint changes from the dashboard) perform a Modbus FC06 write followed by an FC03 read-back to confirm the value was accepted — identical to the BLE confirmation pattern in the medical IoT project.

**Q3. How does OPC-UA integration with Siemens S7 PLCs differ from the Allen-Bradley Modbus approach?**

OPC-UA (IEC 62541) provides a semantically richer integration than Modbus TCP. The Siemens S7-1200 exposes an OPC-UA server with a structured address space: nodes are organized as `Objects/PLC_1/DataBlocks/DB1/Zone_B_Temperature`, with typed values, engineering units, and timestamp metadata embedded in the OPC-UA NodeId. The `plc-bridge` uses the `asyncua` Python library to create an OPC-UA subscription (server-side change notification) rather than polling — the S7 PLC pushes data change notifications when a monitored item's value changes by more than a configurable deadband (e.g., ±0.5°C for temperature). This event-driven model reduces network traffic by 80% compared to 100 ms Modbus polling for slowly changing process variables. The OPC-UA session uses security policy `Basic256Sha256` with certificate-based mutual authentication — the `plc-bridge` presents a client certificate signed by the factory's internal PKI, and the S7 PLC's trusted certificate list is pre-configured with this certificate's thumbprint.

**Q4. Describe the Grafana + Prometheus observability stack and the specific metrics instrumented.**

Prometheus scrapes metrics from four sources: the `vision-api`'s `/metrics` endpoint (Prometheus Python client), the `api-gateway`'s ASP.NET Core metrics middleware, the `plc-bridge`'s `/metrics` endpoint, and the Mosquitto MQTT broker via `mqtt2prometheus` exporter. Key metrics include: `vision_inference_duration_seconds` (histogram, P50/P95/P99 latency), `vision_detections_total` (counter by class and zone), `plc_register_read_errors_total` (counter by PLC and register), `mqtt_messages_published_total` (counter by topic prefix), `api_http_request_duration_seconds` (histogram by method and route), and `pg_stat_activity_count` (gauge from `postgres_exporter`). Grafana dashboards are defined as code in `grafana/dashboards/*.json` provisioned via the `grafana.ini` `[paths]` provisioning configuration — dashboards survive container restarts without manual re-creation. Alert rules in `prometheus/rules/factory.yaml` trigger PagerDuty/Slack notifications for: inference latency P95 > 50 ms, PLC read error rate > 5/min, and MQTT broker disconnects.

**Q5. How is the React TypeScript frontend dashboard integrated with the backend microservices?**

The React 18 frontend is a Vite-built single-page application served by NGINX in a container. It communicates with the `api-gateway` over HTTPS REST for CRUD operations (inventory queries, pallet management, user administration) and over a Secure WebSocket (`wss://`) for real-time data feeds: live detection bounding boxes from the `vision-api` relay, MQTT pub/sub event feed, and Prometheus metrics sparklines (polled via the Prometheus HTTP API at 2-second intervals). State management uses Zustand for global factory state (active zones, PLC connection status) and React Query (TanStack Query) for server-state caching with optimistic updates. TypeScript interfaces are generated from the OpenAPI schema using `openapi-typescript` — the React components never manually define API response types. The Grafana dashboards are embedded as `<iframe>` elements in the React dashboard using Grafana's anonymous embedding mode with `allow_embedding = true` in `grafana.ini`.

**Q6. What PyTorch and TensorFlow roles are differentiated in the vision AI stack?**

YOLOv8 uses PyTorch as its native framework — the model architecture, training loop, and INT8 post-training quantization all use `torch` primitives. PyTorch's `torch.export` serializes the quantized model to a `TorchScript` `.pt` file for production inference. TensorFlow is present in the stack for a secondary quality-control model: a MobileNetV3-based classifier (trained with TensorFlow/Keras) that receives cropped pallet ROIs from YOLOv8's bounding boxes and classifies pallet condition (intact, damaged, missing-label). The TF model is served via TensorFlow Lite on the IPC for low-latency inference without a GPU. Having both frameworks demonstrates multi-framework ML engineering — a realistic scenario in industrial AI where different teams train models with different toolchains and the production system must serve both.

**Q7. How does the .NET C# API gateway fit into an otherwise Python/TypeScript stack?**

The `api-gateway` is implemented in ASP.NET Core 8 (C#) deliberately to demonstrate polyglot microservices architecture — a common reality in enterprise environments where different teams own different services in their preferred languages. The gateway's responsibilities are: OAuth2/JWT validation (using `Microsoft.AspNetCore.Authentication.JwtBearer`), request routing (YARP — Yet Another Reverse Proxy — for HTTP proxying to internal Python services), rate limiting (ASP.NET Core's built-in `RateLimiter` middleware), and OpenTelemetry instrumentation. The .NET gateway is also the appropriate home for the Swagger UI aggregation (combining OpenAPI schemas from all internal services via Swashbuckle) — presenting a unified API explorer to frontend developers. .NET's strong typing and first-class OpenTelemetry SDK support make it an excellent gateway choice for an observability-focused platform.

**Q8. Why is K3s used with PostgreSQL 16 rather than a managed cloud database service?**

The factory edge environment is designed for industrial on-premises deployment where internet connectivity may be intermittent or firewalled for OT security reasons. A managed cloud database (AWS RDS, Azure SQL) is unsuitable for factory-floor deployments requiring offline resilience. PostgreSQL 16 runs as a K3s pod with a `StatefulSet` (ensuring stable network identity and persistent volume binding) backed by a hostPath PV on a RAID-1 NVMe drive on the IPC. WAL archiving via `pg_basebackup` to a local NAS provides point-in-time recovery. PostgreSQL 16's logical replication is configured for eventual sync to a cloud PostgreSQL instance (Azure Database for PostgreSQL Flexible Server) when connectivity is available — providing cloud backup without cloud dependency for runtime operation.

---

## 3. Features & Implementation Q&A

**Q1. How does the live bounding-box pallet detection at 28 FPS work end-to-end?**

The detection pipeline runs as follows: (1) OpenCV `VideoCapture` reads an RTSP H.265 stream from the IP camera at 30 FPS; (2) frames are placed in a `multiprocessing.Queue` with a maxsize of 3 to prevent memory accumulation if inference lags; (3) the inference process dequeues frames, applies letterbox padding to 640×640, normalizes pixel values to `[0,1]`, and runs `model.predict(frame, conf=0.45, iou=0.5, device='cpu')` — the quantized YOLOv8n model completes inference in ~28 ms per frame on a modern Intel Core i5 IPC, achieving 28 FPS; (4) detected bounding boxes (class, confidence, xyxy coordinates) are scaled back to the original frame dimensions and serialized as JSON; (5) the JSON is broadcast to all connected WebSocket clients via FastAPI's `WebSocketBroadcast` helper; (6) simultaneously, aggregated counts per class per zone are published to MQTT and written to PostgreSQL in the batched write path. The React frontend renders bounding boxes as absolutely positioned `<div>` overlays on a `<video>` element displaying an HLS stream of the same camera feed.

**Q2. Describe the PLC integration panel and what controls are exposed to the dashboard operator.**

The PLC integration panel is the primary OT interface in the React dashboard. It shows a live floor-map SVG of the factory zones, with each zone's active PLCs represented as nodes with real-time status (green: connected, red: faulted, yellow: degraded). Clicking a PLC node opens a detail drawer showing: current register values (conveyor speed, motor temperature, fault codes), a 60-second sparkline for each monitored register (rendered using Recharts), and — for admin-role users — a setpoint write form. Setpoint writes are validated client-side against the register's min/max bounds (fetched from the `api-gateway` on drawer open) and then submitted as a `PATCH /api/v1/plc/{plc_id}/registers/{register_name}` request. The gateway forwards the write to the `plc-bridge`, which issues the Modbus FC06 write and returns the readback value within 2 seconds. The dashboard updates optimistically on form submission and reverts if the readback does not match within the deadline.

**Q3. How is the sprint board and deployment history feature implemented?**

The Agile sprint board is a Kanban-style panel built with a `react-beautiful-dnd` drag-and-drop board. For the demo, sprint data (stories, statuses, assignees) is loaded from a static JSON fixture (`src/data/sprint.json`) that mimics an Azure Boards API response format. In a production integration, this would be replaced with live calls to the Azure DevOps REST API (`https://dev.azure.com/{org}/{project}/_apis/work/teamsettings/iterations/{iteration_id}/workitems`). Deployment history is similarly fed from a `deployments.json` fixture mimicking the Azure DevOps Releases API. Each deployment entry shows: environment, deployer, timestamp, build number, commit SHA (linked to GitHub), and pass/fail status. In production, this panel would call `GET https://vsrm.dev.azure.com/{org}/{project}/_apis/release/deployments` with an Azure DevOps PAT stored as a Kubernetes secret and injected into the `api-gateway` as an environment variable.

**Q4. How does the Grafana dashboard embedding work in the React frontend without exposing authentication credentials?**

Grafana is configured with `auth.anonymous` enabled (`enabled = true, org_name = Kamps Factory, org_role = Viewer`) so that the embedded `<iframe>` panels load without requiring a Grafana login from the dashboard user. The anonymous user has Viewer role, restricting it to read-only dashboard access with no ability to edit panels or access data sources directly. The Grafana service is exposed only on the K3s internal cluster network — the React frontend accesses it via a path-based ingress route (`/grafana/`) that the NGINX CORS configuration restricts to the dashboard's own origin. In production, Grafana's anonymous mode would be replaced with Grafana's service accounts + signed embed tokens (Grafana 10+ feature) to maintain read-only access with a short-lived token rather than fully anonymous access.

**Q5. What does the full tech-stack chip overview UI component do, and how is it implemented?**

The tech-stack chip overview is a visual component in the React dashboard's header that renders each technology in the platform as a colored pill/chip — styled with the technology's brand color and icon (using `simple-icons` SVG sprites). Each chip is clickable and opens a detail popover showing: technology version, role in the architecture, health status (green/red based on a K3s pod status API call), and a link to the relevant Grafana dashboard panel for that service. The chip data is defined in `src/data/techStack.ts`, a TypeScript array of `TechChip` objects with fields: `name`, `version`, `color`, `icon`, `role`, `podLabel`. The health status is fetched from `GET /api/v1/cluster/pods` on the `api-gateway`, which calls `kubectl get pods -n kamps-factory -o json` via the Kubernetes API server and returns a simplified status map. This provides a live infrastructure inventory directly in the dashboard.

**Q6. How is the MQTT pub/sub feed surfaced in the React dashboard?**

The dashboard includes a live MQTT feed panel that shows scrolling messages from the factory broker, similar to a real-time log stream. The `api-gateway` maintains a WebSocket relay: it subscribes to the MQTT topic `spBv1.0/#` and re-broadcasts decoded (Protobuf → JSON) messages to connected WebSocket clients on `wss://api-gateway/ws/mqtt-feed`. The React frontend connects to this WebSocket and maintains a circular buffer of the last 200 messages in a Zustand store slice. Each message is rendered as a row in a virtualized list (`react-window`) to prevent DOM bloat during extended operation. Messages are color-coded by topic prefix: sensor data (blue), vision detections (green), PLC commands (amber), and error events (red). The feed can be filtered by zone or message type using a filter chip row above the list. Message timestamps are displayed in the factory's local timezone using `date-fns-tz`.

**Q7. What does the CI/CD pipeline visualization show, and how are the lint → test → build → deploy stages represented?**

The CI/CD pipeline visualization is a horizontal stepper component modeled on Azure DevOps's pipeline run view. Each stage is represented as a node in a DAG (directed acyclic graph) rendered with `reactflow`. For the demo, stage states (pending, running, passed, failed) cycle through an animated simulation with realistic stage durations (Lint: 45s, Unit Tests: 3m20s, Docker Build: 4m10s, K3s Deploy: 2m15s). Test coverage results (92%) and Docker image sizes are shown as metric badges on the respective stage nodes. Clicking a stage node opens a log drawer with simulated terminal output (ANSI color-coded) for that stage. In a production integration, the pipeline data would be fetched from the Azure DevOps Pipelines REST API (`GET /{org}/{project}/_apis/pipelines/{pipeline_id}/runs/{run_id}`) with SSE (Server-Sent Events) for live log streaming from the `api-gateway`'s log relay endpoint.

**Q8. How does the pallet inventory management system work, and what CRUD operations are supported?**

The inventory management panel provides a full CRUD interface for pallet records. The data grid (AG Grid Community Edition) shows columns: Pallet ID, SKU, Zone, Status, Last Detection Timestamp, and Confidence Score. Row-level actions allow operators to: update a pallet's location zone (drag-and-drop on the floor map, triggering a `PATCH /api/v1/pallets/{id}` request), mark a pallet as shipped (`POST /api/v1/pallets/{id}/ship`), and create new pallet records manually (`POST /api/v1/pallets`). Bulk actions include zone-to-zone transfer and CSV export. The grid uses React Query's `useInfiniteQuery` with cursor-based pagination (PostgreSQL keyset pagination using `WHERE pallet_id > $last_id ORDER BY pallet_id LIMIT 50`) for efficient large-dataset browsing. Real-time updates arrive via WebSocket: when the `vision-api` detects a new pallet, a WebSocket message triggers a React Query cache invalidation, refreshing the grid row without a full page reload.

---

## 4. Testing & Quality Q&A

**Q1. How are PLC integration tests implemented without physical hardware?**

PLC integration testing uses a Python-based software PLC simulator (`scripts/mock-plc/mock_plc.py`) that implements a Modbus TCP server using `pymodbus.server.async_io.StartAsyncTcpServer`. The simulator pre-loads register maps from the same YAML configuration files used by the production `plc-bridge`, ensuring test fixtures match production semantics. The simulator supports: static register values (for baseline tests), scripted register sequences (for testing state transitions), and fault injection (e.g., simulating a register read timeout by ignoring a request for 5 seconds). `pytest` fixtures start the simulator in a subprocess before each integration test module and tear it down after. OPC-UA integration tests use `asyncua.Server` to simulate the Siemens S7 address space with the same node IDs used in production, allowing the `plc-bridge`'s OPC-UA subscription logic to be tested without a physical PLC.

**Q2. How is the YOLOv8 vision AI tested for accuracy and regression?**

Model accuracy is tested using a labeled validation dataset of 500 pallet images (manually annotated with LabelImg, stored in YOLO format in `tests/vision/fixtures/`). A `pytest` test `test_model_accuracy.py` runs the model against this dataset and asserts: `mAP@0.5 >= 0.88`, `mAP@0.5:0.95 >= 0.72`, and per-class recall for each pallet class >= 0.85. These thresholds are enforced as quality gates in the CI pipeline. Model regression is detected by storing the baseline mAP in a `metrics_baseline.json` file committed to the repository; if a model update causes mAP to drop by more than 2 percentage points below baseline, the pipeline fails with a regression error. Latency regression testing uses `pytest-benchmark` to assert that the P95 inference latency on a standardized test frame set remains below 40 ms on the CI runner's CPU.

**Q3. What test coverage is achieved, and how is 92% enforced per service?**

Coverage is measured per service using `pytest-cov` (`--cov-report=xml --cov-fail-under=92` for Python services) and `coverlet` with `--threshold 92` for the .NET gateway. Coverage reports are uploaded to Azure DevOps Test Results tab using `reportgenerator` for .NET and `pytest-cov`'s XML output for Python. The pipeline fails if any individual service falls below 90% (a per-service floor) or if the aggregate coverage across all services falls below 92%. Excluded from coverage: auto-generated Protobuf/OpenAPI code (`# pragma: no cover` annotations), `__main__` entry points, and Alembic migration scripts. Coverage trending is tracked over the last 30 pipeline runs and displayed as a badge in the Azure DevOps project dashboard.

**Q4. How are WebSocket and MQTT integration tests implemented?**

WebSocket tests use `pytest-asyncio` with `httpx.AsyncClient` (which supports WebSocket via the ASGI transport layer for FastAPI test clients). A `test_ws_detection.py` fixture connects to the `/ws/detection` WebSocket, injects a mock frame into the detection pipeline via a test hook, and asserts that a bounding-box JSON message arrives within 500 ms. MQTT integration tests use `asyncio-mqtt` in test mode: the test starts an in-process Mosquitto broker (`mosquitto` binary via `subprocess`), publishes a synthetic Sparkplug B message to the topic, and asserts that the `plc-bridge`'s MQTT subscriber callback processes the message and writes the correct values to the test PostgreSQL database (a Docker Compose service started by `pytest-docker`). These tests run in the `IntegrationTest` stage of the CI pipeline, after the unit test stage, using the Docker Compose test environment.

**Q5. What static analysis and linting tools are applied, and what rules are enforced?**

Python services use `ruff` (replacing flake8, isort, and pylint in a single tool) with a strict rule set (`select = ["E", "F", "I", "N", "UP", "ANN"]`) enforcing type annotations on all public functions. `mypy` with `strict = true` enforces full static type checking. The .NET gateway uses `dotnet-format` with the `.editorconfig` C# coding style rules and Roslyn analyzers (`Microsoft.CodeAnalysis.NetAnalyzers`) with `WarningsAsErrors` for all CA-prefixed analyzer rules. The React TypeScript frontend uses ESLint with `eslint-config-airbnb-typescript`, `@typescript-eslint/strict`, and `eslint-plugin-react-hooks` (enforcing the rules of hooks). All four linters run in the `Lint` stage and must produce zero warnings — any warning is treated as a pipeline failure.

**Q6. How is database migration tested and validated in CI?**

Database migrations are managed by `Alembic` (Python, for all Python services' SQLAlchemy models) and `EF Core Migrations` (for any .NET-managed schema changes). CI starts a fresh PostgreSQL 16 Docker container, applies all migrations from scratch (`alembic upgrade head`), runs the full test suite against this clean schema, and then tests the downgrade path (`alembic downgrade -1`) for the latest migration to verify rollback safety. A dedicated `test_migrations.py` test asserts that: (1) all SQLAlchemy `Base.metadata` tables exist after `upgrade head`; (2) all expected indexes exist via `pg_indexes` queries; (3) row-level security policies are active on the `pallets` and `detections` tables; and (4) no migration leaves the database in a partial-apply state (validated by checking Alembic's `alembic_version` table after each step).

---

## 5. Security Q&A

**Q1. How is the OT/IT network boundary secured against unauthorized PLC commands from the IT layer?**

Network segmentation is enforced at three layers. At the physical/VLAN layer, OT devices (PLCs, IP cameras) are on a dedicated VLAN (VLAN 100) with inter-VLAN routing blocked by the factory firewall except for the IPC's `plc-bridge` IP address on a specific Modbus TCP port (502) and OPC-UA port (4840). At the application layer, the `plc-bridge` is the only service with credentials to connect to PLCs; its PLC credentials (Modbus unit IDs, OPC-UA username/password) are stored in a Kubernetes secret mounted as environment variables — no other pod has access to these secrets per Kubernetes RBAC `Role` bindings. At the protocol layer, all Modbus TCP write operations from the `plc-bridge` are gated by a software interlock: the `api-gateway` must have validated an `admin`-scoped JWT and the request payload must pass range validation before the `plc-bridge` will issue an FC06 write. A separate read-only Modbus connection (different unit ID) handles polling, so a compromised polling path cannot be escalated to write access.

**Q2. How are Kubernetes secrets and environment credentials managed securely?**

Kubernetes Secrets are used for all credentials: database passwords, MQTT broker passwords, OAuth2 client secrets, Azure DevOps PATs, and PLC credentials. Secrets are created from the Azure DevOps pipeline using `kubectl create secret generic` with values sourced from Azure Key Vault (via the Azure DevOps Key Vault task) — secrets are never committed to the repository or stored in plain text in pipeline YAML. The K3s cluster uses the `sealed-secrets` controller (Bitnami) so that encrypted `SealedSecret` manifests can be safely committed to the GitOps repository — only the in-cluster `sealed-secrets` controller can decrypt them using its RSA private key. Pod security contexts enforce `readOnlyRootFilesystem: true`, `runAsNonRoot: true`, and `allowPrivilegeEscalation: false` on all service containers, limiting the blast radius of a container compromise.

**Q3. How is OAuth2 token validation protected against replay and token substitution attacks?**

The `api-gateway` validates JWTs using the RS256 algorithm with the identity provider's JWKS public key fetched at startup and refreshed every 24 hours. The `aud` claim is validated against the expected `api-gateway` audience identifier — preventing a token issued for a different service from being used against this API. The `iat` and `nbf` claims are validated with a 30-second clock skew tolerance. JTI (JWT ID) claim-based replay prevention is implemented for high-value operations (PLC writes, user creation): the JTI is written to a Redis sorted set with the token's expiry as the score; duplicate JTIs are rejected with a 409 Conflict response. Refresh tokens are single-use: the identity provider issues a new refresh token on each use and immediately invalidates the previous one, preventing refresh token replay from a compromised session.

**Q4. What protections are in place for the MQTT broker against unauthorized publish or subscribe?**

Mosquitto 2.x uses a plugin-based access control list (ACL). The ACL file (`mosquitto/acl.conf`) grants publish rights to specific client IDs (matching the `plc-bridge` service account) on the `spBv1.0/#` topic hierarchy and subscribe rights to specific client IDs (matching vision, gateway, and prometheus exporter accounts). The broker requires TLS client certificates for all connections — unauthenticated connections are rejected at the transport layer. A `password_file` provides an additional credential layer for services that do not use client certificates. Retained messages are disabled on the PLC data topics to prevent a new subscriber from receiving stale PLC state from before a known-good state was established. The broker's `max_connections` is configured to `100` and `max_inflight_messages` to `20` to limit resource exhaustion from a misbehaving client.

**Q5. How does the platform address supply chain security for its Docker images and Python dependencies?**

All Docker base images are pinned by SHA256 digest in the Dockerfiles (`FROM python:3.12.3-slim@sha256:abc123...`) — not by tag, which is mutable. The `trivy` vulnerability scanner runs in the `ScanAndValidate` pipeline stage against each built image, failing the pipeline on any `CRITICAL` or `HIGH` CVE. Python dependencies are pinned in `requirements.txt` (generated by `pip-compile` from `requirements.in`) and verified with `pip-audit` against the OSV vulnerability database. The Node.js frontend uses `npm audit --audit-level=high` with a zero-tolerance policy for high/critical npm vulnerabilities. A `Dependabot` configuration (`dependabot.yml`) automatically opens PRs to update pinned dependencies weekly. Docker images are signed using `cosign` (Sigstore) after the successful build stage — the K3s admission webhook (`policy-controller`) rejects pods using unsigned images.

**Q6. What data privacy protections are applied to factory telemetry data?**

Factory telemetry (PLC sensor data, detection logs) is classified as sensitive business data rather than personal data, but is treated with equivalent controls for competitive confidentiality. At rest, PostgreSQL data is encrypted via Transparent Data Encryption (TDE) using the `pgcrypto` extension for sensitive columns (trade-secret process parameters) and full-disk encryption on the IPC's NVMe drive (LUKS2 with a TPM2-bound key). In transit, all internal cluster traffic uses mutual TLS enforced by the K3s built-in service mesh (`Traefik` with TLS passthrough for inter-service communication and a `cert-manager`-issued cluster CA). External access to the dashboard is restricted by IP allowlist at the ingress level — only the factory's office network CIDR range is permitted to reach the Traefik ingress endpoint. Data retention policies delete raw detection records older than 90 days (configurable), replaced by hourly aggregates for long-term trend analysis.

---

## 6. Source Code Update Guide

### Prerequisites

- Docker Desktop 4.30+ or Docker Engine 26+ with BuildKit enabled
- K3s 1.30+ or `k3d` for local cluster simulation
- Python 3.12+ with `pip-tools` (`pip install pip-tools`)
- .NET 8 SDK (`dotnet --version`)
- Node.js 20 LTS + npm 10
- Azure DevOps CLI (`az devops --version`) — optional for pipeline management

### Repository Structure

```
FullStackEngineer/
├── services/
│   ├── vision-api/          # FastAPI Python — YOLOv8 inference
│   ├── plc-bridge/          # FastAPI Python — Modbus/OPC-UA
│   ├── api-gateway/         # ASP.NET Core C# — auth + routing
│   └── mqtt-broker/         # Mosquitto config + TLS certs
├── frontend/kamps-factory/  # React 18 + TypeScript + Vite
├── k8s/                     # Kubernetes manifests
├── grafana/                 # Dashboard JSON + provisioning
├── prometheus/              # prometheus.yml + alert rules
├── scripts/                 # Mock PLC, code gen, utilities
├── openapi/                 # openapi.yaml — API contract
└── azure-pipelines.yml      # CI/CD pipeline definition
```

### Updating Vision AI Model

```bash
# 1. Retrain or download updated model
yolo export model=yolov8n.pt format=torchscript optimize=True

# 2. Quantize to INT8
python scripts/quantize_model.py --input yolov8n.torchscript \
  --calibration-data data/calibration/ \
  --output services/vision-api/models/yolov8n_int8.pt

# 3. Run accuracy validation
pytest tests/vision/test_model_accuracy.py -v

# 4. Update model version in services/vision-api/config.py
MODEL_PATH = "models/yolov8n_int8.pt"
MODEL_VERSION = "1.3.0"
```

### Updating PLC Register Maps

```bash
# Edit the YAML register map
vim services/plc-bridge/config/allen-bradley-registers.yaml
# Add new register entry:
# - register: 40025
#   name: new_sensor_name
#   scale: 0.01
#   unit: bar

# Regenerate Pydantic models from register map
python scripts/gen_plc_models.py \
  --input services/plc-bridge/config/allen-bradley-registers.yaml \
  --output services/plc-bridge/models/generated_registers.py

# Update tests
vim tests/plc-bridge/test_modbus.py  # add test for new register
pytest tests/plc-bridge/ -v
```

### Updating the React Frontend

```bash
cd frontend/kamps-factory
npm install

# Generate TypeScript types from updated OpenAPI schema
npx openapi-typescript ../openapi/openapi.yaml -o src/generated/api.d.ts

# Add/update a component
# Components live in src/components/
# Store slices in src/store/
# API hooks in src/hooks/

npm run dev        # Start Vite dev server (hot reload)
npm run type-check # TypeScript check
npm run lint       # ESLint
npm run test       # Jest unit tests
```

---

## 7. Build & Compile Instructions

### Build All Services (Docker)

```bash
# Build all images using Docker Bake
cd FullStackEngineer
docker buildx bake -f docker-bake.hcl \
  --set "*.platform=linux/amd64" \
  --load

# Build individual services
docker build -t kamps/vision-api:latest services/vision-api/
docker build -t kamps/plc-bridge:latest services/plc-bridge/
docker build -t kamps/api-gateway:latest services/api-gateway/
docker build -t kamps/frontend:latest frontend/kamps-factory/
```

### Python Services

```bash
cd services/vision-api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Run locally
uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# Run tests
pytest --cov=. --cov-report=term-missing --cov-fail-under=92
```

### .NET API Gateway

```bash
cd services/api-gateway
dotnet restore
dotnet build --configuration Release
dotnet test --configuration Release /p:CollectCoverage=true /p:Threshold=92

# Publish for Docker
dotnet publish --configuration Release --output publish/
```

### React Frontend

```bash
cd frontend/kamps-factory
npm ci
npm run build    # Vite production build → dist/
npm run preview  # Preview production build locally
```

---

## 8. Deployment Guide

### Local Development (Docker Compose)

```bash
# Start all services locally
docker compose -f docker-compose.dev.yml up --build

# Services accessible at:
# Frontend:   http://localhost:3000
# API Gateway: http://localhost:5000
# Vision API: http://localhost:8001
# Grafana:    http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090

# Start mock PLC simulator
python scripts/mock-plc/mock_plc.py \
  --modbus-port 502 \
  --opcua-port 4840
```

### Staging (K3d Local K3s Cluster)

```bash
# Create local K3s cluster
k3d cluster create kamps-staging --servers 1 --agents 2 \
  --port "80:80@loadbalancer" --port "443:443@loadbalancer"

# Load images into k3d
k3d image import kamps/vision-api:latest kamps/plc-bridge:latest \
  kamps/api-gateway:latest kamps/frontend:latest \
  -c kamps-staging

# Apply manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets-staging.yaml
kubectl apply -f k8s/

# Verify
kubectl get pods -n kamps-factory
kubectl get ingress -n kamps-factory
```

### Production (Factory IPC K3s)

```bash
# Install K3s on IPC (single-node)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server \
  --disable traefik \
  --tls-san <IPC_IP>" sh -

# Install NGINX ingress controller
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace

# Install cert-manager for TLS
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set installCRDs=true

# Install sealed-secrets controller
helm install sealed-secrets sealed-secrets/sealed-secrets \
  --namespace kube-system

# Create production secrets (from Azure Key Vault via pipeline)
kubectl create secret generic kamps-secrets \
  --from-literal=db-password=$DB_PASSWORD \
  --from-literal=mqtt-password=$MQTT_PASSWORD \
  --from-literal=oauth-client-secret=$OAUTH_SECRET \
  -n kamps-factory

# Deploy application
kubectl apply -f k8s/production/

# Monitor rollout
kubectl rollout status deployment/vision-api -n kamps-factory
kubectl rollout status deployment/api-gateway -n kamps-factory
kubectl rollout status deployment/plc-bridge -n kamps-factory

# Verify services
kubectl get pods -n kamps-factory
curl -k https://<IPC_IP>/api/v1/health
```

### Azure DevOps Pipeline Trigger

```bash
# Trigger pipeline manually
az pipelines run --name "Kamps-Smart-Factory-CI" \
  --branch main \
  --organization https://dev.azure.com/<org> \
  --project KampsFactory

# Monitor pipeline run
az pipelines runs show --id <run_id> \
  --organization https://dev.azure.com/<org> \
  --project KampsFactory
```

### Mobile Builds

```bash
# Android APK (from CI artifacts)
gh release download --repo delongkevin/FullStackEngineer \
  --pattern "kamps-factory-*.apk" --dir .

# iOS TestFlight (triggered via Xcode Cloud or Fastlane)
cd ios/KampsFactory
bundle exec fastlane testflight
```

---

## 9. Full-Scale Adaptation Notes

**TimescaleDB for Time-Series Data:** Replace raw PostgreSQL with TimescaleDB for the `detections` and `plc_events` tables. TimescaleDB's automatic time partitioning (hypertables) and columnar compression reduce storage by 90x for time-series workloads and enable continuous aggregate queries for Grafana dashboards without full-table scans.

**Multi-Node K3s HA Cluster:** Production factories typically deploy 3 control-plane nodes (K3s HA mode with embedded etcd) and 3+ agent nodes, with node affinity rules ensuring `vision-api` runs on GPU-equipped nodes and `plc-bridge` runs on nodes with physical network access to the OT VLAN.

**GPU-Accelerated Inference:** Deploy an NVIDIA Jetson AGX Orin or discrete GPU node for the `vision-api`. Replace INT8 TorchScript with TensorRT-optimized `.engine` files achieving 200+ FPS, enabling multi-camera zone coverage without additional hardware.

**Kafka for MQTT Bridging:** Replace direct MQTT-to-PostgreSQL writes with a Kafka bridge (MQTT → Kafka via Kafka Connect Camel MQTT Source Connector → PostgreSQL via Kafka Connect JDBC Sink). Kafka provides durable message retention, replay capability for model retraining data pipelines, and decouples data consumers from the real-time ingestion rate.

**ISA-95 / IEC 62443 Compliance:** Full industrial deployment requires ISA-95 Level 3 MES integration (SAP ME, Ignition SCADA), IEC 62443-3-3 security level certification for the OT network boundary, and a formal Functional Safety assessment (IEC 61511) for any PLC write operations that could affect physical safety.

**Multi-Factory Tenancy:** Extend the data model with a `tenant_id` dimension (factory ID), deploy separate K3s clusters per factory (or namespaces with strict resource quotas), and implement a central management plane (Rancher or Cluster API) for fleet management, policy enforcement, and centralized observability aggregation.
