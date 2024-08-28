import { createContext } from 'react';
export const UserContext = (createContext < User) | (undefined > undefined);

// class UserContext extends Component {
//     state = { user: null };
//     fetchUserData = async () => {
//         try {
//             const response = await Inertia.get('/user-data'); // Endpoint to get user data
//             this.setState({ user: response.data });
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//         }
//     };
//     render() {
//         return (
//             <UserContext.Provider value={this.state.user}>
//                 {this.props.children}
//             </UserContext.Provider>
//         );
//     }
// }

// export default UserContext;
