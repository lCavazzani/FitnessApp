import React, {Component} from 'react';
import {View} from 'react-native'
import {getMetricMetaInfo} from '../utils/helpers'
import MySlider from './MySlider'
import MyStepper from './MyStepper'
import DateHeader from './date'


export default class AddEntry extends Component {

    state = {
        run:0,
        bike:0,
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


    render(){

        const metaInfo = getMetricMetaInfo();
        return(
            <View>
                <DateHeader
                    date = {(new Date()).toLocaleDateString()} />
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
            </View>
        )
    }
}
