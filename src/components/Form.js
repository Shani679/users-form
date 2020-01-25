import React, {Component, Fragment} from 'react';
import { Input } from './input';
import { DateTimePicker } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';
import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

const initialState = {
    firstName: "",
    lastName: "",
    workplaces: [{name: "", start: null, end: null, error: false}],
    firstName_err: false,
    lastName_err: false,
}

class Form extends Component{

    state = {
        ...initialState,
        tooltip: false
    }

    componentDidUpdate(prevProps, prevState){
        if(!prevState.tooltip && this.state.tooltip){
            setTimeout(() => {
                this.setState({...this.state, tooltip: false})
            }, 5000);
        }
    }

    onChangeHandler(name, value){
        this.setState({...this.state, [name]: value, [`${name}_err`]: false})
    }

    onClickAddMore(e){
        e.preventDefault();
        const workplaces = [...this.state.workplaces, {name: "", start: null, end: null, error: false}];
        this.setState({...this.state, workplaces})
    }

    onSelectDate(date, direction, index){
        const currentWorkplace = {...this.state.workplaces[index], [direction]: date};
        const workplaces = [...this.state.workplaces];
        workplaces.splice(index, 1, currentWorkplace);
        this.setState({...this.state, workplaces});
    }

    onChangeWkName(index, name){
        const currentWorkplace = {...this.state.workplaces[index], name, error: false};
        const workplaces = [...this.state.workplaces];
        workplaces.splice(index, 1, currentWorkplace);
        this.setState({...this.state, workplaces});
    }

    removeWk(index){
        const workplaces = [...this.state.workplaces];
        workplaces.splice(index, 1);
        this.setState({...this.state, workplaces});
    }

    onSubmit = e => {
        e.preventDefault();
        if(this.validate()){
            this.setState({tooltip: true, ...initialState})
        }
    }

    validate(){
        let isValid = true;
        const newState = {};
        if(this.state.firstName === ""){
            newState.firstName_err = "Required field";
            isValid = false;
        }
        if(this.state.lastName === ""){
            newState.lastName_err = "Required field";
            isValid = false;
        }
        const workplaces = this.state.workplaces.map(wk => {
            isValid = isValid && wk.name !== "";
            return {
                ...wk,
                error: wk.name !== "" ? false: "Missing workplace name"
            }
        })
        this.setState({...this.state, ...newState, workplaces})
        return isValid;
    }

    render(){
        moment.locale('en');
        momentLocalizer();
        return (
            <form>
                {this.state.tooltip && <div id="tooltip">User was added successfully</div>}
                <h1>User details</h1>
                <Input defaultValue={this.state.firstName} name="firstName" placeholder="First name" error={this.state.firstName_err} onChange={(name, value) => this.onChangeHandler(name, value)}/>
                <Input defaultValue={this.state.lastName} name="lastName" placeholder="Last name" error={this.state.lastName_err} onChange={(name, value) => this.onChangeHandler(name, value)}/>
                <h3>Past workplaces</h3>
                {this.state.workplaces.map((wk, i) => 
                    <div key={i} className="workplace">
                        <Input defaultValue={wk.name} placeholder="Workplace name" onChange={(name, value) => this.onChangeWkName(i, value)}/>
                        <DateTimePicker time={false} max={wk.end ? new Date(wk.end) : new Date()} value={wk.start} placeholder="Start date" onChange={value => this.onSelectDate(value, "start", i)}/>
                        <DateTimePicker time={false} {...(wk.start ? {min: new Date(wk.start)} : {})} max={new Date()} value={wk.end} placeholder="End date" onChange={value => this.onSelectDate(value, "end", i)}/>
                        {wk.error && <p>{wk.error}</p>}
                        {this.state.workplaces.length > 1 && <span onClick={() => this.removeWk(i)}>Remove</span>}
                    </div>)}
                {this.state.workplaces.length < 10 && <button id="add" onClick={(e) => this.onClickAddMore(e)}>Add workplace</button>}
                <button id="submit" onClick={this.onSubmit}>Submit</button>
            </form>
        )
    }
}

export default Form;