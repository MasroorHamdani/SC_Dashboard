import * as firebase from 'firebase';
import {Component} from 'react';

class FirebaseData extends Component {
    getReference = (collection, doc) => {
        return firebase.firestore().collection(collection).doc(doc).collection('DATA');
    }

    onCollectionUpdate = (querySnapshot) => {
        const dispenser = [];
        querySnapshot.forEach((doc) => {
            dispenser.push(doc.data());
        });
        return dispenser;
    }
}
export default FirebaseData;