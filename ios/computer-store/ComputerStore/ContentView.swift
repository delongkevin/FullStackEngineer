import SwiftUI

struct ContentView: View {
    let products = [
        Product(name: "MacBook Pro M3", category: "Laptops", price: 1999.00),
        Product(name: "Dell XPS 15", category: "Laptops", price: 1499.00),
        Product(name: "NVIDIA RTX 4090", category: "GPUs", price: 1599.00),
        Product(name: "Intel Core i9-14900K", category: "CPUs", price: 549.00),
        Product(name: "Samsung 990 Pro 2TB", category: "Storage", price: 149.00),
    ]

    @State private var cartItems: [Product] = []
    @State private var selectedCategory = "All"

    let categories = ["All", "Laptops", "GPUs", "CPUs", "Storage"]

    var filtered: [Product] {
        selectedCategory == "All" ? products : products.filter { $0.category == selectedCategory }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Picker("Category", selection: $selectedCategory) {
                    ForEach(categories, id: \.self) { Text($0) }
                }
                .pickerStyle(.segmented)
                .padding()

                List(filtered) { product in
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(product.name).font(.headline)
                            Text(product.category).font(.caption).foregroundStyle(.secondary)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 4) {
                            Text(String(format: "$%.2f", product.price)).fontWeight(.semibold)
                            Button("Add") { cartItems.append(product) }
                                .buttonStyle(.borderedProminent)
                                .controlSize(.small)
                        }
                    }
                }
            }
            .navigationTitle("🛒 Computer Store")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Label("\(cartItems.count)", systemImage: "cart").badge(cartItems.count)
                }
            }
        }
    }
}

struct Product: Identifiable {
    let id = UUID()
    let name: String
    let category: String
    let price: Double
}

#Preview { ContentView() }
