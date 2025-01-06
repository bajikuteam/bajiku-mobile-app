import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -30 }, { translateY: -30 }],
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    toggleButtonText: {
      color: '#fff',
      fontSize: 16,
      // padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      borderRadius: 25,
      // marginBottom: 10,
      // marginTop: 10,
    },
    privateContent: {
      position: 'relative',
      height: 500,
      width: '100%',
    },
    blurView: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end', 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      height: '70%',
      backgroundColor: '#1e1e1c',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      elevation: 5,
      zIndex: 1000,
       },
    commentContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 15,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    commentUserImage: {
      height: 38,
      width: 38,
      borderRadius: 12,
      marginRight: 10,
    },
    commentContent: {
      flex: 1,
    },
    commentUsername: {
      color: '#fff',
      textTransform:'lowercase',
      fontWeight: 'bold',
    },
    commentText: {
      color: '#ccc',
      marginVertical: 2,
    },
    commentTime: {
      color: 'gray',
      fontSize: 12,
    },
    closeButton: {
      position: 'absolute',
      top: 10, 
      right: 20, 
      // backgroundColor: 'rgba(255, 255, 255, 0.6)', 
      borderRadius: 50,
      padding: 10,
    },
  closeButtonText: {
    fontSize: 20,
    color: "#fff",
  },
    noCommentsText: {
      textAlign: 'center',
      marginVertical: 20,
      fontSize: 16,
      color: '#777', 
    },
    replySection: {
      marginTop: 8, 
      paddingLeft: 48, 
    },
    replyContainer: {
      flexDirection : 'row',
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      padding: 8,
      marginTop: 4,
      elevation: 1,
    },
    replyUsername: {
      fontWeight: 'bold',
       textTransform:"lowercase"
    },
    replyText: {
      marginVertical: 2,
    },
    replyTime: {
      color: '#888',
      fontSize: 10,
    },
    replyList: {
      maxHeight: 100, 
      marginTop: 4,
    },
    iconContainer: {
      alignItems: 'center',
    },
    iconText: {
      color: 'gray', 
      fontSize: 12,
      marginTop: 2, 
      fontWeight: 'bold',
    },
    likeCount: {
      marginLeft: 5,
      color: 'gray',
      fontSize: 14,
    },
    commentActions: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginTop: 5,
    },
    likeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    replyButton: {
      backgroundColor: '#D84773', 
      borderRadius: 5,
      padding: 5,
      paddingHorizontal: 10,
    },
    replyButtonText: {
      color: 'white',
      fontSize: 14,
    },
    repliesContainer: { 
      marginLeft: 50,
      marginTop: 10,
    },
    replyContent: { 
      flex: 1,
    },
    toggleRepliesText: {
      color: 'blue',
      marginTop: 5,
      textDecorationLine: 'underline', 
    },
    replyUserImage: {
      width: 36,
      height: 36,
      borderRadius: 12,
      marginRight: 8,
      
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#888',
    },
    expandBtn:{
      color:'#fff', 
      fontSize:14,
      textTransform:"capitalize",
      fontWeight:'bold'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#000000',
      top:30
    },
    likeButtonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#2d2d2d',  
      borderRadius: 50,             
      padding: 10,                
      borderWidth: 1,              
      borderColor: '#888',         
      marginLeft: 10,              
      justifyContent: 'center',    
      height: 45,                  
      width: 45,                   
    },
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    toggleContainerBtn:{
      width: '40%'
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    activeButton: {
      textDecorationLine: 'underline',  
    },
  
    captionText: {
      fontSize: 14,
      color: '#fff', 
      padding: 5,
      textShadowColor: '#000',
      textShadowOffset: { width: 1, height: 1 }, 
      textShadowRadius: 2, 
      lineHeight: 20, 
      fontWeight: 'bold',
      // backgroundColor: 'rgba(0, 0, 0, 0.1)', 
      borderRadius: 5, 
    },
    activeTab: {
      // backgroundColor: '#488fee',  
      // borderColor: '#488fee', 
           // Optionally change border color
    },

    activeTabText: {
      color: 'red', 
      textDecorationLine: 'underline',
      textDecorationColor: '#fff', 
    },
    toggleButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      // borderWidth: 1,
      borderColor: '#ccc',
    },
  });


  export default styles;