/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Image, ImageEditor, ImageStore} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import axios from 'axios'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

export default class App extends Component<Props> {
  constructor(props){
    super(props)
    this.state = {
      src:'',
      obj:{}
    }
  }
  _press = () => {
    ImagePicker.openPicker( {width:300, height:300, cropping:true})
    .then( (file) => {
        ImageEditor.cropImage( file.path, {offset:{x:file.cropRect.x,y:file.cropRect.y},size:{width:300,height:300}}, 
        (finalimage) => { ImageStore.getBase64ForTag(finalimage, (image) => {console.log(image);this.setState({src:image,obj:file});ImageStore.removeImageForTag(finalimage);
        ImageStore.hasImageForTag(finalimage, (result) => console.log(result))}, (error) => {console.log(error)}) },(error)=>{console.log(error)})
      // console.log(file)
      })
    .catch((rej) => {
      
    })
  }

  _press2 = () => {
    console.log(this.state)
    let localUri = this.state.obj.sourceURL;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? 'image/${match[1]}' : 'image';

    let formData = new FormData();
    formData.append('image', { uri: 'data:'+this.state.obj.mime+';base64,'+this.state.src, name: filename, type });
    axios.post('', formData, { headers: { 'content-type': 'multipart/form-data' } })
      .then((res) => console.log(res))
      .catch(err => console.log(err.response))
      }
  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: 'data:'+this.state.obj.mime+';base64,'+this.state.src}} style={{width:300,height:300}}/>
        <Button onPress={this._press} title="Click"></Button>
        <Button onPress={this._press2} title="Upload"></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
