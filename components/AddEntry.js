import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native'
import {getMetricMetaInfo, timeToString} from '../utils/helpers'
import MySlider from './MySlider'
import MyStepper from './MyStepper'
import DateHeader from './date'

function SubmitBtn ({onPress}){
    return (
        <TouchableOpacity
        onPress={onPress}>
        <Text>SUBMIT</Text>
        </TouchableOpacity>
    )
}


export default class AddEntry extends Component {

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

        this.setState(() => ({
            run:0,
            bike:0,
            swin:0,
            sleep:0,
            eat:0,
        }))
    }

    render(){

        const metaInfo = getMetricMetaInfo();
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
