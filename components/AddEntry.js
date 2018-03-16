import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native'
import {getMetricMetaInfo, timeToString, getDailyReminderValue} from '../utils/helpers'
import MySlider from './MySlider'
import MyStepper from './MyStepper'
import DateHeader from './date'
import {Ionicons} from '@expo/vector-icons'
import TextButton from './TextButton'
import {submitEntry, removeEntry} from '../utils/api'
import {connect} from 'react-redux'
import {addEntry} from '../actions'

function SubmitBtn ({onPress}){
    return (
        <TouchableOpacity
        onPress={onPress}>
        <Text>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {

    state = {
        run:0,
        bike:50,
        swin:0,
        sleep:0,
        eat:0,
    }

    increment = (metric) => {
        const {step, max} = getMetricMetaInfo(metric);
        this.setState((state) =>{
            const count = state[metric] + step

            return{
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }
    decrement = (metric) => {
        const {step, max} = getMetricMetaInfo(metric);
        this.setState((state) =>{
            const count = state[metric] - step

            return{
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }
    slide = (metric, value) => {
        this.setState(()=>({
            [metric]: value,
        }))
    }
    submit = () =>{
        const key = timeToString();
        const entry = this.state;

        this.props.dispatch(addEntry({
            [key]:entry
        }))

        this.setState(() => ({
            run:0,
            bike:0,
            swin:0,
            sleep:0,
            eat:0,
        }))

        submitEntry({key, entry})
    }
    reset = () => {
        const key = timeToString();
        removeEntry({key})
        this.props.dispatch(addEntry({
            [key]:getDailyReminderValue()
        }))

    }


    render(){

        const metaInfo = getMetricMetaInfo();

        if(this.props.alreadyLogged){
            return(
            <View>
                <Ionicons
                    name='ios-happy-outline'
                    size={100}
                    />
                <Text>You already logged your information today</Text>
                <TextButton onPress={this.reset}>
                reset
                </TextButton>
            </View>
            )
        }
        return(
            <View>
                <DateHeader
                    date = {(new Date()).toLocaleDateString()} />
                    <Text>{JSON.stringify(this.state)}</Text>
                {Object.keys(metaInfo).map((key)=>{
                    const {getIcon, type, ...rest} = metaInfo[key];
                    const value = this.state[key];
                    return(
                        <View>
                            {getIcon()}
                            {type === 'slider'
                            ? <MySlider 
                                value = {value} 
                                onChange = {(value)=> this.slide(key, value)} 
                                {...rest}/>
                            :   <MyStepper
                                value = {value}
                                onIncrement = {() => this.increment(key)}
                                onDecrement = {() => this.decrement(key)}
                                {...rest}/>
                            }
                        </View>
                    )
                })}
                <SubmitBtn onPress = {this.submit} />
            </View>
        )
    }
}

function mapStateToProps(state){
    const key = timeToString()
    return{
         alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}
export default connect(
     mapStateToProps)(AddEntry)