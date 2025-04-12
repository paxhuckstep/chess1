# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
////////////////////////////////////////////////////////////////////////////////////////////

This is a personal project of mine to challenge my skills and help grow as a developer.
The goal is simple, make a fully functional chess board on my own.
Sub-goal: rely on AI as little as possible to help develop my own skills as a programmer.


Going into this project, I knew there was a lot of technical challenges ahead of me. Some I knew would be hard, some harder than expected, and others easier than expected.

The piece that was definitely easier than expected was the knight.
Although probably the most confusing to knew players of chess, it was the easiest to code. The possible moves are always the same, and once the if statement of "handlePossibelLegalKnightMoves" was made, the rest was easy.

Checking obstacles for the knight is just making sure you don't land on your own piece. Which I end up re-using for every other piece, I could rename "handleKnightObstacles" to "handleDontMoveOnSameColor" which could help with readibility because "handleKnightObstacles" is used in every other piece's osbtacle handling function. But I like the way it is. It pairs nicely with "handlePossbleLegalQueenMoves" just being a combination of "handlePossibleLegalBishopMoves" and "handlePossibleLegalRookMoves". 

The bishop ended up being the biggest surprise in difficulty to code. Cleanly checking diagonals wasn't obvious initially, you can see my first method in "handlePossibleLegalBishopMoves" for finding diagonals. Compared to the later approach inside of "isSquareSeen: isDiagonalAttack" where I got a little help from AI, I thought the AI's solution was very clever and used it for diagonal calculations beyond that point, but kept my original solution to show my creativity. "handleBishopObstacles" was terrifying to think about at first, however after I figured out "handleRookObstacles" adjusting it for the bishop was not that bad at all.

"handleRookObstacles" has some extra code in it that doesn't ever do anything when interacting with a rook. However because I wanted "handleQueenObstacles" to just call "handleBishopObstacles" and "handleRookObstacles" I had to adjust "handleRookObstacles" so that it would stop setting squares on the diagonals to false when random criteria was met. It's something small, but I think it's fun.

"handleIsPinnedToKing" took a lot of thinking about away from my computer. I knew it was going to be a challenge, and I was correct. There are multiple complicating factors, the main one being that a piece pinned to the king can still move, it just can't expose the king to check, so you can't just freeze it. My inital thought was to just set all squares that aren't within a "queen's vision" of the king to false whenever a selected peice is pinned to the king. However this allowed a piece pinned diagonally to the king to still move to a square vertical of the king, and vice-versa. So not only do you have to check if a piece is pinned to the king, you need to know how it is pinned, and then set all squares that aren't along that pin's direction to false. "handleIsPinnedToKing" does all of that, and I am happy with how it turned out.

When working on "handleIsPinnedToKing" I quickly realized that a rook pinning a piece to the king from above or below effected the piece in exactly the same way, so we only keep track of if the pin is vertical, horizontal, upLeftDiagonal, or upRightDiagonal. We don't care about which side of the piece the attacking piece and king are on.

When actually checking for a pin (we'll use horizontal as an example) we are checking two things. If the closest piece horizontally on either side is a rook / queen of the opposite color, and if the closest piece (again on either side) is the king of the same color. Not having to keep track of which piece is on which side is nice piece of game logic that made it much easier to code, you just check that they're the 2 closest pieces horizontally. Checking the closest pieces in each direction has a lot of logic barrowed from the obstacle hanlding of rooks and bishops.

For "handleIsChecked" I was really struggling to solve for allowing pieces to move and block the check because I needed to move the piece inside the boardData to check if it would block the check or not. Eventually I asked AI and it suggested creating a copy of the board to do the checks, and use the results to deal with the piece's legal moves on the real board. This solution ended up working seamlessly. 

I still need to add pawn promotion, en pessant, and turns. I only expect en pessant to be a challenge. Turns will super easy and I'm doing it last because testing is so much easier without having to worry about turns. And pawn promotion shouldn't be that bad, just some extra html elements need to be made for selecting what piece you're promoting to. 

deployed at: 
paxchess.netlify.app