import styled from 'styled-components/native';
import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
    backgroundVideo: {
        alignItems: "stretch",
        position: "absolute",
        height: Dimensions.get("window").height, 
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    }
});

export const Container = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: center;
    background: red;
`;

export const NewsByFollowing = styled.View`
    position: absolute;
    left: 10%;
    right: 10%;
    top: 5%;
    z-index: 99;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const NewsByFollowingText = styled.Text`
    color: #FFF;
`;

export const NewsByFollowingTextBold = styled.Text`
    font-weight: bold;
    font-size: 15px;
    color: #FFF;
`;

export const ContentRight = styled.View`
    position: absolute;
    padding: 10px;
    right: 5px;
    top: 30%;
    bottom: 20%;
    z-index: 99;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ContentLeft = styled.View`
    position: absolute;
    padding: 10px;
    left: 5px;
    top: 30%;
    bottom: 20%;
    z-index: 99;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ContentLeftImg = styled.View`
    position: absolute;
    padding: 10px;
    left: 20px;
    top: 10%;
    z-index: 99;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
       width: 40px;
    height: 40px;
    border-radius: 25px;
`;


export const PContentLeftImg = styled.View`
    position: absolute;
    padding: 10px;
    left: 20px;
    top: 15%;
    z-index: 99;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
       width: 40px;
    height: 40px;
    border-radius: 25px;
`;


export const FullScreen = styled.View`
    position: absolute;
    padding: 10px;
    right: 10px;
    top: 0;
    z-index: 1000;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

`;

export const ContentCaption = styled.View`
    position: absolute;
    padding: 10px;
    left: 10px;
    top: 0;
    z-index: 1000;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

`;
export const PContentCaption = styled.View`
    position: absolute;
    padding: 10px;
    left: 10px;
    top: 8%;
    z-index: 1000;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

`;
export const ContentRightUser = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    border-radius: 25px;
    background: red;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #555;
`;

export const Image = styled.Image`
    width: 40px;
    height: 40px;
    border-radius: 25px;
`;

export const ContentRightUserPlus = styled.View`
    top: -10px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    background: #F00;
`;

export const ContentRightHeart = styled.TouchableOpacity`
    margin-top: 10px;
    margin-bottom: 10px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ContentRightComment = styled.TouchableOpacity`
    margin-top: 10px;
    margin-bottom: 10px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ContentRightWhatsApp = styled.TouchableOpacity`
    margin-top: 10px;
    margin-bottom: 10px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ContentRightWhatsAppImage = styled.Image`
   width: 30px;
   height: 30px;
`;

export const ContentRightText = styled.Text`
    margin-top: 10px;
    font-weight: bold;
    color: #FFF;
`;

export const ContentLeftBottom = styled.View`
    position: absolute;
    padding: 10px;
    left: 5px;
    bottom: 10%;
    z-index: 99;
    width: 75%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
`;

export const ContentLeftBottomNameUser = styled.TouchableOpacity`

`;
export const ContentLeftBottomNameUserText = styled.Text`
    color: #FFF;
    font-weight: bold;
     position: absolute;
    padding: 10px;
    left: 5px;
    top: 65%;
    bottom: 20%;
    z-index: 99;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
     textTransform: 'lowercase',
`;

export const ContentLeftBottomDescription = styled.Text`
    margin-top: 10px;
    color: #FFF;
`;

export const ContentLeftBottomMusic = styled.Text`
    margin-top: 10px;
    color: #FFF;
    overflow: scroll;
`;