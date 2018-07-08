import { JsonController, Get, Post, HttpCode, BodyParam, Put, Param, Body, NotFoundError, BadRequestError } from 'routing-controllers'
import Game from './entity'

const defaultBoard = [
	['o', 'o', 'o'],
	['o', 'o', 'o'],
	['o', 'o', 'o']
]

const colors = ["red", "blue", "green", "yellow", "magenta"]

const moves = (board1, board2) => 
  board1
    .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
    .reduce((a, b) => a.concat(b))
    .length


@JsonController()
export default class GameController {
    //getting a list of games
    @Get('/games')
    async allGames() {
        const games = await Game.find()
        return { games }
    }

   @Post('/games')
    @HttpCode(201)
    createGame(
        @BodyParam("name") name: string
    ) {            
        const game = new Game
        game.name = name
        game.color = colors[Math.floor(Math.random() * colors.length)]
        game.board = defaultBoard
        return game.save()
    }

    @Put('/games/:id')
    async updateGame(
        @Param('id') id: number,
        @Body() update: Partial<Game>
    ) { 
        const game = await Game.findOne(id)
        if (!game) throw new NotFoundError('Cannot find a game')
        //if there is updates for board, check on moves
        if (update.board) {
            if (moves(game.board, update.board) > 1) 
                throw new BadRequestError('You are only allowed one move per turn')   
        }          
        return Game.merge(game, update).save() 
    }    
}