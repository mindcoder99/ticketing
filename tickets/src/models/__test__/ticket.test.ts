import {Ticket} from '../ticket'
// becasue jest does not understand async await very well, "done" call back needs to be invoked manually
it('implements optimistic conccurrency control', async (done)=>{
 // create an instance of a ticket
 const ticket = Ticket.build({
     title: 'concert',
     price: 5,
    userId:'123' })
  
 // save the ticket to databse
  await ticket.save()
 // fetch the ticket twice 
 const firstInstance = await Ticket.findById(ticket.id)
 const secondInstance = await Ticket.findById(ticket.id)

 // make to separate changes to the tickets we fetched
 firstInstance!.set({price:10})
 secondInstance!.set({price:10})

 // save the first fetched ticket
 await firstInstance!.save()
 
 // save the second fetched ticket and expect an error (because of outdated version)
 try{
    await secondInstance!.save()
 }catch(err){
     return done()
 }
 
 throw new Error('should not reach this point')
})

it('increments the version number in multiple saves', async ()=>{
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
       userId:'123' })
     
    await ticket.save();
    expect(ticket.version).toEqual(0)

    await ticket.save();
    expect(ticket.version).toEqual(1)

    await ticket.save();
    expect(ticket.version).toEqual(2)



})