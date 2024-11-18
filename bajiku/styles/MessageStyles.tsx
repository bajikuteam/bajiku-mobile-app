import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 10px; /* Changed to a single padding property */
  background-color: #ffffff;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px; /* Rounded corners */
  elevation: 2; /* Android shadow */
  shadow-color: #000; /* iOS shadow */
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  shadow-offset: 0px 2px;
  margin-bottom: 10px; /* Space between cards */
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center; /* Center items vertically */
  padding: 10px; /* Padding around user info */
`;

export const UserImgWrapper = styled.View`
  margin-right: 10px; /* Space between image and text */
`;

export const UserImg = styled.Image`
  width: 36px; /* Increased size */
  height: 36px;
  border-radius: 10px; /* Circular image */
`;

export const TextSection = styled.View`
  flex: 1; /* Take up the remaining space */
  padding: 5px; /* Padding inside text section */
`;

export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between; /* Space between username and time */
  margin-bottom: 5px; /* Space between lines */
`;

export const UserName = styled.Text`
  font-size: 16px; /* Increased font size */
  font-weight: bold;
  color: #333; /* Dark color for contrast */
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #999; /* Lighter color for timestamp */
`;

export const MessageText = styled.Text`
  font-size: 14px;
  color: #666; /* Subtle color for message preview */
`;

export const NewMessageCountWrapper = styled.View`
  background-color: #34b7f1; /* WhatsApp blue color */
  border-radius: 10px; /* Rounded corners */
  padding: 5px 8px; /* Padding inside the badge */
  position: absolute; /* Position it over the text */
  top: 10px; /* Adjust positioning */
  right: 10px; /* Adjust positioning */
`;

export const NewMessageCountText = styled.Text`
  color: #fff; /* White text for contrast */
  font-size: 12px; /* Size of the count text */
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text`
  color: #888;
  font-size: 16px;
`;
