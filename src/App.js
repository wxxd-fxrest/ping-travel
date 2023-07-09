import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { db } from "./firebase";
import Router from "./Router";

const App = () => {
  const [mainPing, setMainPing] = useState([]); 

  useEffect(() => {
    const FeedCollection = query(
        collection(db, "MainPing"));
      onSnapshot(FeedCollection, (querySnapshot) => {
        let feedArray = []
        querySnapshot.forEach((doc) => {
            feedArray.push({
                DocID: doc.id, 
                Data: doc.data(),
            })
        });
        setMainPing(feedArray);
        console.log(mainPing)
    });
  }, []); 

  return (
    <>
      <Router mainPing={mainPing} />
    </>
  );
};

export default App;
