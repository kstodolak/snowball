const express = require('express');
const app = express();
const bodyParser = require('body-parser');

let score = 0;

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin! TEST');
});

app.post('/', function (req, res) {
    // console.log(req.body);
    const selfHref = req.body._links.self.href;
    const selfInfo = req.body.arena.state[selfHref];

    const { dims } = req.body.arena;


    const move = () => {
        const changeDirection = ['R', 'L'];
        let moves = ['F']; 

        if(selfInfo.x < 3 && selfInfo.direction === 'W') {
            moves = moves.concat(changeDirection);
        }

        if(selfInfo.x > req.body.arena.dims[0] - 3 && selfInfo.direction === 'E') {
            moves = moves.concat(changeDirection);
        }

        if(selfInfo.y < 3 && selfInfo.direction === 'N') {
            moves = moves.concat(changeDirection);
        }

        if(selfInfo.x > req.body.arena.dims[1] - 3 && selfInfo.direction === 'S') {
            moves = moves.concat(changeDirection);
        }

        res.send(moves[Math.floor(Math.random() * moves.length)]);
    }

    const shot = () => {
        res.send('T')
    }

    const moveOrShot = (randomNumber) => {
        if(randomNumber < 5) {
            move();
        } else{
            shot();
        }
    }

    if(score < selfInfo.score) {
        score = selfInfo.score;
        shot();
        return;
    }

    if(selfInfo.wasHit) {
        score = selfInfo.score;
        move();
        return;
    }

    score = selfInfo.score;
    moveOrShot(Math.floor(Math.random() * 10));
});

app.listen(process.env.PORT || 8080);