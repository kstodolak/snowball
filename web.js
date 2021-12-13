const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const e = require('express');

let score = 0;
let shotLast = false;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Let the battle begin! TEST 2');
});

app.post('/', function (req, res) {
    // console.log(req.body);
    const selfHref = req.body._links.self.href;
    const selfInfo = req.body.arena.state[selfHref];

    const { dims } = req.body.arena;


    const move = () => {
        const changeDirection = ['R'];
        let moves = ['F', 'F', 'R'];

        if (selfInfo.x < 3 && selfInfo.direction === 'W') {
            moves = changeDirection;
        }

        if (selfInfo.x > req.body.arena.dims[0] - 3 && selfInfo.direction === 'E') {
            moves = changeDirection;
        }

        if (selfInfo.y < 3 && selfInfo.direction === 'N') {
            moves = changeDirection;
        }

        if (selfInfo.x > req.body.arena.dims[1] - 3 && selfInfo.direction === 'S') {
            moves = changeDirection;
        }

        shotLast = false;
        res.send(moves[Math.floor(Math.random() * moves.length)]);
    }

    const shot = () => {
        shotLast = true;
        res.send('T')
    }

    const moveOrShot = (randomNumber) => {
        if (randomNumber < 5) {
            move();
        } else {
            shot();
        }
    }

    const tryToFind = () => {
        if (shotLast) {
            move();
        } else {
            shot();
        }
    }

    if (selfInfo.wasHit) {
        score = selfInfo.score;
        move();
        return;
    }

    if (score < selfInfo.score) {
        score = selfInfo.score;
        shot();
        return;
    }

    if (score >= selfInfo.score) {
        score = selfInfo.score;
        tryToFind();
        return;
    }

    // tryToFind();
    score = selfInfo.score;
    moveOrShot(Math.floor(Math.random() * 10));
});

app.listen(process.env.PORT || 8080);
