import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    mediaContainer: {
      flex: 1,
      position: "relative",
    },
    postTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 15,
      color: "#fff",
    },
    postContent: {
      fontSize: 16,
      color: "#fff",
      marginBottom: 20,
    },
    postImage: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
    },
    videoContainer: {
      width: "100%",
      height: "100%",
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginTop: 10,
    },
    videoIcon: {
      position: "absolute",
      top: "40%",
      left: "40%",
      color: "#fff",
      zIndex: 1,
    },
    addCommentWrapper: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: "#ccc",
      zIndex: 2,
    },
    iconContainer: {
      alignItems: "center",
    },
  
    commentActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 5,
    },
    likeContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    likeCount: {
      marginLeft: 5,
      color: "gray",
      fontSize: 14,
    },
    replyButton: {
      backgroundColor: "#D84773",
      borderRadius: 5,
      padding: 5,
      paddingHorizontal: 10,
    },
    replyButtonText: {
      color: "white",
      fontSize: 14,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      height: "70%",
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      elevation: 5,
      zIndex: 1000,
    },
    commentContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 15,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "gray",
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
      color: "black",
    },
    commentText: {
      color: "#ccc",
      marginVertical: 2,
    },
    commentTime: {
      color: "gray",
      fontSize: 12,
    },
    closeButton: {
      marginLeft: "auto",
      padding: 10,
    },
    closeButtonText: {
      fontSize: 18,
      color: "black",
    },
    noCommentsText: {
      textAlign: "center",
      marginVertical: 20,
      fontSize: 16,
      color: "#777",
    },
    replySection: {
      marginTop: 8,
      paddingLeft: 48,
    },
    replyContainer: {
      flexDirection: "row",
      backgroundColor: "#f9f9f9",
      borderRadius: 8,
      padding: 8,
      marginTop: 4,
      elevation: 1,
    },
    replyUsername: {
      fontWeight: "bold",
    },
    replyText: {
      marginVertical: 2,
    },
    replyTime: {
      color: "#888",
      fontSize: 10,
    },
    replyList: {
      maxHeight: 100,
      marginTop: 4,
    },
    repliesContainer: {
      marginLeft: 50,
      marginTop: 10,
    },
    replyContent: {
      flex: 1,
    },
    toggleRepliesText: {
      color: "blue",
      marginTop: 5,
      textDecorationLine: "underline",
    },
    replyUserImage: {
      width: 36,
      height: 36,
      borderRadius: 12,
      marginRight: 8,
    },
    iconText: {
      color: "gray",
      fontSize: 12,
      marginTop: 2,
    },
    blurView: {
      position: "absolute",
      top: "7%",
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "black",
    },
    ownershipMessageContainer: {
      padding: 10,
      backgroundColor: '#000',
      borderRadius: 5,
      marginBottom: 15,
    },
    ownershipMessage: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: 200,              
      position: 'absolute',    
      top: "8%",                
      right: 6,               
      shadowColor: '#000',    
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.25,     
      shadowRadius: 4,         
      zIndex: 1000,      
    },
    
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalButton: {
      fontSize: 16,
      marginVertical: 10,
      color: '#007BFF',
    },
    modalCloseButton: {
      fontSize: 16,
      marginTop: 20,
      color: 'red',
    },
    confirmationBox: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    confirmationText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      borderRadius: 5, 
    },
  });

  export default styles;