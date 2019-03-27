import React, { Component } from 'react';
import './Menu.css';
import {Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {select} from "../../actions/index";


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            isDisabled: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }


    componentWillMount() {
        let request = new XMLHttpRequest();
        let recordData;
        request.open('GET', 'http://localhost:3200/', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = ()=>{
            recordData = JSON.parse(request.responseText);
            this.props.select(recordData);
        };
        request.onerror = function() {
            alert('Ошибка ' + this.status);
        };
        request.send();
    };

    handleChange = (event) => {
        console.log(event.target.value);
          if(event.target.value){
              this.setState({userName : event.target.value, isDisabled: false});
          }
          else
          {
              this.setState({userName : event.target.value, isDisabled: true});
          }
    };

    renderTable () {

        return( this.props.records !== null ?
            this.props.records.userName.map((element, index) =>
                    <tr>
                        <td>{element}</td>
                        <td>{this.props.records.userSpeed[index]}</td>
                    </tr>)
                :
                <div>
                    ДАННЫЕ РЕКОРДОВ НЕ ЗАГРУЖЕНЫ!!!
                </div>
        )
    }


    render(){
        const {userName,isDisabled} = this.state;
        console.log(this.props.records);
        return(
            <div id="window">
                {/*<button onClick={()=>this.props.select(this.state.recordData)}>LOAD</button>*/}
                <div id="content">
                <div id = "nameBox">Имя игрока:</div>
                <input type="text"  id="inputUser" className="inputUser" onChange={this.handleChange}/>
                <Link id="link" to={{
                        pathname: '/Game',
                        state: {userName}
                    }}> <button id="buttonStart" disabled={isDisabled}>Старт</button></Link>
                    <table id = "recordsTable" title="Таблица рекордов">
                        <caption>Таблица рекордов</caption>
                        <tr>
                            <th>Имя</th>
                            <th>Скорость</th>
                        </tr>
                        {this.renderTable()}

                        {/*<caption>Таблица рекордов:</caption>*/}
                        {/*<tr>*/}
                            {/*<td>Имя:</td>*/}
                            {/*<td>Скорость:</td>*/}
                        {/*</tr>*/}
                        {/*{recordData.userName.map((element, index) =>*/}
                        {/*<tr><td>' + element + '</td><td>' + recordData.userSpeed[index] + '</td></tr>)}*/}
                    </table>

                </div>
            </div>
        );

    }

}
function mapStateToProps(state) {
    return{
        records: state.records
    };
}
function matchDispatchToProps (dispatch){
    return bindActionCreators({select: select}, dispatch)

}

export default connect(mapStateToProps, matchDispatchToProps)(Menu);
