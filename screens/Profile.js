import React, { Component } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ScrollView, Button } from "react-native";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";
import * as ImagePicker from 'expo-image-picker';


var updatedURI;
var uid;
var hasUpdated = false;




export default class Login extends Component {

    writeUserData(userId, imageUrl) {
        firebase.database().ref('users/' + userId).set({
          profile_picture : imageUrl
        });
    }

    uploadImage(imageUrl) {
        var storageRef = storage.ref();
        var imagesRef = storageRef.child('newProfilePicture');
        imagesRef.putFile(imageUrl);
    }


    updateProfilePic = async () => {
        hasUpdated = true;
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            } else {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                if (!result.cancelled) {
                    updatedURI = result.uri;
                    //this.uploadImage(imageUrl);
                    //this.writeUserData(uid, )

                }

            }
        }
    };


    render() {
        var user = firebase.auth().currentUser;
        var storage = firebase.storage();
        var displayName;
        var photoURL;
        

        if (user != null) {
            uid = user.uid;
        
            var nameRef = firebase.database().ref('users/' + uid + '/first_name');
            nameRef.on('value', (snapshot) => {
                const data = snapshot.val();
                displayName = data;
            });

            var profilePicRef = firebase.database().ref('users/' + uid + '/profile_picture');
            profilePicRef.on('value', (snapshot) => {
                const data = snapshot.val();
                photoURL = data;
            });
        } else {
            displayName = "No User";
        }

        return(
            <SafeAreaView style={styles.container}>
                <View style={{ alignSelf: "center", marginTop: "20%" }}>
                    <View style={styles.profileImage}>
                        <Image source={user ? hasUpdated
                                                ? {uri: updatedURI}
                                                : {url: `${photoURL}`}
                                            
                                            : require('../images/no-profile-pic.jpg')} style={styles.image} resizeMode="cover"></Image>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{user ? displayName : "No User"}</Text>
                </View>

                <View style={styles.statsContainer}>
    
                    <View style={styles.statsBox}>
                        {/* <Text style={[styles.text, { fontSize: 24 }]}>30</Text> */}
    
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Friends')}
                        >
                            <Text style={[styles.text, {fontSize:24} ]}> 30
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.text, styles.subText]}>Friends</Text>
                    </View>
                </View>
                <View style={{ alignSelf: 'center', margin: 10 }}>
                    <Button
                        title="Change Profile Picture"
                        onPress={() => this.updateProfilePic()}
                         />
                       
                 

                </View>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
       
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
    
    subText: {
        fontSize: 16,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500",
        marginTop: 5
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"
    },
   
    
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    
});