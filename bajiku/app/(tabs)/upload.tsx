
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
 
const postsData = [
    {
      mediaSrc: 'https://res.cloudinary.com/dmfb370xe/video/upload/v1725999915/WhatsApp_Video_2024-09-10_at_21.23.00_vjjpj3.mp4',
      caption: 'This is the first post caption.',
      comments: [],
      profilePicSrc: 'https://example.com/profile1.jpg',
      username: 'User1',
      time: '2 hours ago',
    },
    {
      mediaSrc: 'https://res.cloudinary.com/dmfb370xe/video/upload/v1725999915/WhatsApp_Video_2024-09-10_at_21.23.00_vjjpj3.mp4',
      caption: 'This is the second post caption.',
      comments: [],
      profilePicSrc: 'https://example.com/profile2.jpg',
      username: 'User2',
      time: '3 hours ago',
    },
    {
        mediaSrc: 'https://res.cloudinary.com/dmfb370xe/video/upload/v1725999915/WhatsApp_Video_2024-09-10_at_21.23.00_vjjpj3.mp4',
        caption: 'This is the second post caption.',
        comments: [],
        profilePicSrc: 'https://example.com/profile2.jpg',
        username: 'User2',
        time: '3 hours ago',
      },
      {
        mediaSrc: 'https://res.cloudinary.com/dmfb370xe/video/upload/v1725999915/WhatsApp_Video_2024-09-10_at_21.23.00_vjjpj3.mp4',
        caption: 'This is the second post caption.',
        comments: [],
        profilePicSrc: 'https://example.com/profile2.jpg',
        username: 'User2',
        time: '3 hours ago',
      },
    // Add more posts as needed
  ];
const UploadScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
         {/* <ImageUpload/> */}
            {/* <View style={  styles.sidebar}>   <Sidebar/></View> */}
      {/* {postsData.map((post, index) => (
        <PostWithCaption
              key={index}
              mediaSrc={post.mediaSrc}
              caption={post.caption}
              comments={post.comments}
              profilePicSrc={post.profilePicSrc}
              username={post.username}
              time={post.time} likes={0}        />
      ))} */}
        {/* <MediaPlayer mediaSrc={'https://res.cloudinary.com/dmfb370xe/video/upload/v1725999915/WhatsApp_Video_2024-09-10_at_21.23.00_vjjpj3.mp4'} caption={''} comments={[]} likes={0} profilePicSrc={''} username={''} time={''} /> */}
    </ScrollView>
    );
}

 
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
    //   padding: 16,
      backgroundColor: 'black',
    },
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 10, 
        height: '100%',
        width: '100%', 
  
    },
  });
export default UploadScreen;