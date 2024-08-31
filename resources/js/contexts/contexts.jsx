import React, { Component, createContext } from 'react';

export const UserContext = createContext();

class userContextProvider extends Component {
    state = {
        userName: 'John Doe',
    };
    render() {
        return (
            <UserContext.Provider
                value={{
                    isUser: this.state.isUser,
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default userContextProvider;
