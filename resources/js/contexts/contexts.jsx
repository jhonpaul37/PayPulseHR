import React, { Component, createContext } from 'react';

export const userContext = createContext();

class userContextProvider extends Component {
    state = {
        isUser: true
     }
    render() {
        return ();
    }
}

export default userContextProvider;


// import React, { Component, createContext } from 'react';

// // Create the context
// export const UserContext = createContext();

// // Create the context provider component
// class UserContextProvider extends Component {
//     state = {
//         isUser: true
//     };

//     render() {
//         return (
//             <UserContext.Provider value={{
//                 isUser: this.state.isUser
//             }}>
//                 {this.props.children}
//             </UserContext.Provider>
//         );
//     }
// }

// export default UserContextProvider;

