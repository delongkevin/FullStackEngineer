pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "PortfolioApps"
include(":book-app")
include(":computer-store")
include(":poker-app")
include(":kamps-factory")
include(":embedded-video")
include(":medical-iot-monitor")
include(":insurance-app")
include(":order-system")
include(":task-manager")
include(":avionics-test")
include(":om-platform")
include(":sit-dashboard")
include(":qa-dashboard")
include(":ai-trainer")
include(":a11y-qa-trainer")
include(":sap-test-manager")
include(":erp-workbench")
include(":wireless-audio")
