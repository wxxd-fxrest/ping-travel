// /* eslint-disable no-redeclare */
// import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../AuthContext';
// import styled from "styled-components";
// import { db } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import ReviewQuestion from '../components/ReviewQuestion';
// import MenuBar from './MenuBar';
// // import MARKER from '../img/marker.png';
// // import questionMarker from '../img/question_marker.png';

// // MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// // questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

// const Home = ({mainPing}) => {
//     const {currentUser} = useContext(AuthContext);
//     const [loginUserData, setLoginUserData] = useState([]);
//     const [friendRequest, setFriendRequest] = useState([]);
//     const [share, setShare] = useState([]);

//     const getLoginUserData = useCallback(async () =>  {
//         if(currentUser.uid) {
//             const docRef = doc(db, "UserInfo", `${currentUser.uid}`);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//             setLoginUserData(docSnap.data());
//             setFriendRequest(docSnap.data().friendRequest);
//             setShare(docSnap.data().shareAlert);
//             // console.log(docSnap.data())
//             } else {
//             console.log("No such document!");
//             }
//         } else {
//             return;
//         }
//     }, [currentUser.uid]);

//     useEffect(() => {
//         getLoginUserData();
//     }, [currentUser.uid, getLoginUserData]);

//     return (
//         <Container>
//             {/* <MenuBar friendRequest={friendRequest} loginUserData={loginUserData} share={share}/> */}
//             <h4 style={{color:"green", margin: "10px"}}> ReviewQuestion </h4>
//             <ReviewQuestion mainPing={mainPing} />
//         </Container>
//     );
// };

// const Container = styled.div``;

// export default Home;