import SwiftUI

enum GameState { case idle, dealt, won, lost }

struct ContentView: View {
    let suits = ["♠️", "♥️", "♦️", "♣️"]
    let ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    @State private var hand: [String] = []
    @State private var chips = 1000
    @State private var bet = 50
    @State private var gameState: GameState = .idle

    var message: String {
        switch gameState {
        case .idle:  return "Place your bet and deal!"
        case .dealt: return "Cards dealt — tap New Hand to continue."
        case .won:   return "🎉 You win \(bet) chips!"
        case .lost:  return "😔 You lost \(bet) chips."
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("Chips: \(chips)").font(.title2).fontWeight(.semibold)

                HStack(spacing: 8) {
                    ForEach(hand, id: \.self) { card in
                        Text(card)
                            .font(.system(size: 28))
                            .frame(width: 56, height: 80)
                            .background(Color.white)
                            .cornerRadius(8)
                            .shadow(radius: 3)
                    }
                }
                .frame(minHeight: 80)

                Text(message).font(.headline).multilineTextAlignment(.center)

                HStack(spacing: 16) {
                    Stepper("Bet: \(bet)", value: $bet, in: 10...min(chips, 500), step: 10)
                        .frame(maxWidth: 200)
                }

                HStack(spacing: 16) {
                    Button("Deal") {
                        hand = (0..<5).map { _ in
                            (suits.randomElement() ?? "♠️") + (ranks.randomElement() ?? "A")
                        }
                        let win = Bool.random()
                        if win {
                            chips += bet
                            gameState = .won
                        } else {
                            chips -= bet
                            gameState = .lost
                        }
                        if chips <= 0 { chips = 1000 }
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(gameState == .dealt)

                    Button("New Hand") { hand = []; gameState = .idle }
                        .buttonStyle(.bordered)
                        .disabled(gameState == .idle)
                }
            }
            .padding()
            .navigationTitle("♠️ Poker App")
        }
    }
}

#Preview { ContentView() }
