// import buildClient from '../api/build-client';
import Link from 'next/link'
const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket =>{
      return(
        <tr key={ticket.id}>
           <td>{ticket.title}</td>
           <td>{ticket.price}</td>
           <td>
             <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
                <a>view</a>
             </Link>
           </td>
        </tr>
      )
    })
   return(
     <div>
       <h1> Tickets </h1>
       <table className='table'>
         <thead>
              <tr>
                <th>Title </th>
                <th>Price</th>
                <th>Link</th>
              </tr>
         </thead>
         <tbody>
            {ticketList.length===0? 'ticket not found': ticketList}
         </tbody>
       </table>
     </div>
   )

};

// if getInit function of child component is not manually called, it won't be invoked automatically because we have 
// defined getInit function of _app.js

LandingPage.getInitialProps = async (context,client,currentUser) => {
  const {data} = await client.get('/api/tickets')
  return {tickets: data}
};

export default LandingPage;
