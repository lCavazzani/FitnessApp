import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Platform, StyleSheet} from 'react-native'
import {getMetricMetaInfo, timeToString, getDailyReminderValue} from '../utils/helpers'
import MySlider from './MySlider'
import MyStepper from './MyStepper'
import DateHeader from './date'
import {Ionicons} from '@expo/vector-icons'
import TextButton from './TextButton'
import {submitEntry, removeEntry} from '../utils/api'
import {connect} from 'react-redux'
import {addEntry} from '../actions'
import { purple, pink, red } from '../utils/colors';

function SubmitBtn ({onPress}){
    return (
        <TouchableOpacity
        style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
        onPress={onPress}>
        <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {

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
            <View style={styles.center}>
                <Ionicons
                    name={Platform.OS==='ios' ? 'ios-happy-outline' : 'md-happy'}
                    size={100}
                    />
                <Text>You already logged your information today</Text>
                <TextButton style={{padding: 10}} onPress={this.reset}>
                Reset
                </TextButton>
            </View>
            )
        }
        return(
            <View style= {styles.container}>
                <DateHeader
                    date = {(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map((key)=>{
                    const {getIcon, type, ...rest} = metaInfo[key];
                    const value = this.state[key];
                    return(
                        <View key={key} style={styles.row}>
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

const styles = StyleSheet.create({
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height:45,
        marginLeft: 40, 
        marginRight: 40
    },
    row:{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    androidSubmitBtn:{
        backgroundColor: purple,
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 2,
        height:45,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText:{
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    },
    center:{
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    }

})

function mapStateToProps(state){
    const key = timeToString()
    return{
         alreadyLogged: state[key] && typeof state[key].today === 'undefined'
    }
}
export default connect(
     mapStateToProps)(AddEntry)