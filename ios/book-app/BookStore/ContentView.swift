import SwiftUI

struct ContentView: View {
    let books = [
        Book(title: "Clean Code", author: "Robert C. Martin", price: 29.99),
        Book(title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 34.99),
        Book(title: "Design Patterns", author: "Gang of Four", price: 39.99),
        Book(title: "Refactoring", author: "Martin Fowler", price: 31.99),
    ]

    @State private var cartCount = 0

    var body: some View {
        NavigationStack {
            List(books) { book in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(book.title).font(.headline)
                        Text(book.author).font(.subheadline).foregroundStyle(.secondary)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 4) {
                        Text(String(format: "$%.2f", book.price)).fontWeight(.semibold)
                        Button("Add") { cartCount += 1 }
                            .buttonStyle(.borderedProminent)
                            .controlSize(.small)
                    }
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("📚 Book Store")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Label("\(cartCount)", systemImage: "cart")
                        .badge(cartCount)
                }
            }
        }
    }
}

struct Book: Identifiable {
    let id = UUID()
    let title: String
    let author: String
    let price: Double
}

#Preview {
    ContentView()
}
