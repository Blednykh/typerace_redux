import React, { Component } from 'react';
import './Game.css';
import stopwatch from './stopwatch.png';
import hurt from './hurt.png';
import {Link} from "react-router-dom";



class Game extends Component{
    constructor(props){
        super(props);
        this.state ={
            userName: '',
            text: '',
            typedText: '',
            mistakeText: '',
            words: [],
            wordId: 0,
            userSpeed: 0,
            lives: 3,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.setRandomText = this.setRandomText.bind(this);
    }
    componentDidMount() {
        const inputElem = document.getElementById('inputElem');
        const timerElem = document.getElementById('timerElem');
        let userName = this.props.location.state.userName;
        this.setState({
            userName: this.props.location.state.userName,
            typedText: '',
            mistakeText: '',
            wordId: 0,
            lives: 3,
            userSpeed: 0,
        });
        this.setRandomText();
        inputElem.value = '';
        let time = 90;
        timerElem.innerText = time;
        const timerId = setInterval(()=> {
            time--;
            timerElem.innerText = time;
            timerElem.style.color = (time <= 10) ? 'red' : 'black';
            let lettersCount = this.state.typedText.split(' ').slice(0, this.state.wordId).join('').length;

            if ((time % 3) === 0) {
                let lps = 60 * lettersCount / (90 - time);

                this.state.userSpeed = lps.toFixed(2);

            }
            if (this.state.lives === 0) {
                clearTimeout(timerId);
                if (window.confirm('Слишком много ошибок! Попробовать ещё раз?')) { this.componentDidMount(); }
            }
            if (this.state.wordId === this.state.words.length) {
                clearTimeout(timerId);
                let data = JSON.stringify({ userName: this.state.userName, userSpeed: this.state.userSpeed });

                let request = new XMLHttpRequest();

                request.open('POST', 'http://localhost:3200/', true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.addEventListener('load', function() {
                    console.log(request.response);
                });
                request.send(data);
                if (window.confirm(`Успешно!\n
       Ваша скорость: ${this.state.userSpeed} символов в секунду \n
       Количество слов в тексте: ${this.state.words.length}\n
       Количество жизней: ${this.state.lives}\n
       Попробовать улучшить результат?`)) {this.componentDidMount(); }
            }
        }, 1000);

        setTimeout(() =>{
            console.log(this.state.userName);
            clearInterval(timerId);
            timerElem.innerText = '0';

            if (window.confirm(`Время вышло!\n
    Скорее всего из-за того, что ваша скорость всего: ${this.state.userSpeed} символов в секунду \n
    Попробовать ещё раз?`)) { this.componentDidMount(); }
        }, 90000);
    };

    setLiveBar(){
        let liveBarList=[];
        for(let i=0;i<this.state.lives;i++)
            liveBarList.push(<img id="live" src={hurt}/>);
        return liveBarList;
    }

    setRandomText() {

        const type = 'sentence';
        const number = 1;
        const params = '&type=' + type + '&number=' + number;

        fetch('https://fish-text.ru/get?' + params)
            .then(response => response.json())
            .then(json => this.setState({text : json.text, words: json.text.split(' ')}));
    }

    handleChange = (event) => {
        const inputElem = document.getElementById('inputElem');
        let {words,wordId} = this.state;
        if(event.target.value[event.target.value.length-1]=== ' ' && event.target.value.substring(0, event.target.value.length - 1) === words[wordId]){
            wordId++;
            inputElem.value = '';
        }
        if(wordId === this.state.words.length){
            this.setState({wordId});
            return;
        }
        let str = words.slice(wordId + 1, words.length).join(' ');
        this.setState({text: str});

        let typedText = '';

        let mistakeText = '';

        let text = '';

        let letters = words[wordId].split('');

        let error = false;


        letters.forEach((item, i, arr) => {
            if (item === event.target.value[i] && (!error)) {
                typedText += item;
            } else {
                error = true;
                if (event.target.value[i] === undefined) { text += item; } else { mistakeText += item; }
            }
        });

        if (mistakeText === '') { inputElem.style.background = 'white';}
        else {
            inputElem.style.background = 'red';
            /*let elem = document.getElementById('liveImg' + state.lives);
               document.getElementById('liveBar').removeChild(elem); state.lives--;*/
        }

        if(mistakeText.length > this.state.mistakeText.length){
            this.setState({lives: this.state.lives-1});
        }

        this.setState({
            typedText: words.slice(0, wordId).join(' ') + ' ' + typedText,
            mistakeText: mistakeText,
            text: text + ' ' + str,
            wordId: wordId
        });


    };
render(){
    return(
        <div id ="gameWindow">
            <div id = "liveBar">
                {this.setLiveBar().map((element) =>
                    element
                )}
            </div>
            <div id="text">
                <span id="typedTextElem">{this.state.typedText}</span><span id="mistakeElem">{this.state.mistakeText}</span><span id="textElem">{this.state.text}</span>
            </div>
            <input type="text" id="inputElem" onChange={this.handleChange}/>
            <div id = "timerBox">
                <div id = "timerContent">
                    <span id="timerElem">90</span>
                    <img id="stopwatch" src={stopwatch}/>
                </div>
            </div>
            <span id="cpsElem"> Ваша скорость: {this.state.userSpeed} символов в секунду!</span>
            <Link id = "gameLink" to="/"><button id="buttonBack">На главную</button></Link>
        </div>
    );

}

}

export default Game;
