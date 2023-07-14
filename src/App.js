import { collection, onSnapshot, query } from "firebase/firestore";
import React, {useEffect, useState } from "react";
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
    });
  }, []); 

  
  return (
    <Router mainPing={mainPing} />
  );
};

export default App;
