import { useEffect, useState } from "react";
import "./games.css";
import {v4 as uuid} from "uuid";

export default function Games(){

     
  const [games,setGames] = useState([]);
  const [data,setData] = useState({gamename:"",gameauthor:"",gametags:"",gameprice:"",forkids:false,gamedesc:"",gamerating:5})
  const [search,setSeaarch] = useState("");
  const [issort,setissort] = useState(true);
  useEffect(()=>{
     getData();
  },[]);


  const searchbox = (e)=>{
       setSeaarch(e.target.value);
       fetch("http://localhost:3001/games")
       .then(d=>d.json())
       .then((res)=>{setGames(res.filter((a)=>{return a.gamename.startsWith(search)}))});

  }

  const handlechange = (e)=>{
       var {name} = e.target;
      setData({...data,[name]:e.target.value});
  }

  const getData = ()=>{
     fetch("http://localhost:3001/games")
     .then(d=>d.json())
     .then((res)=>{setGames(res.sort(
     function(a, b) {
          var nameA = a.gamename.toUpperCase(); 
          var nameB = b.gamename.toUpperCase(); 
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1; 
          }
          return 0; 
        }))});
  }

  const setdata = ()=>{
       for(let k in data){
            if(data[k] === ""){
                 alert(`${k} not to be empty`);
                 return;
            }
       }
     fetch("http://localhost:3001/games",{
          method:"POST",
          body:JSON.stringify({...data,id:uuid()}),
          headers:{
               "content-type":"application/json"
          }
     })
     .then(getData());
  }

  const sortbyrating = ()=>{
          fetch("http://localhost:3001/games")
          .then(d=>d.json())
          .then((res)=>{if(!issort){setGames(res.sort((a,b)=>{return a.gamerating-b.gamerating}))}else{setGames(res.sort((a,b)=>{return b.gamerating-a.gamerating}))}setissort(!issort)});
     }
  const sortbyprice = ()=>{
     fetch("http://localhost:3001/games")
     .then(d=>d.json())
     .then((res)=>{if(!issort){setGames(res.sort((a,b)=>{return a.gameprice-b.gameprice}))}else{setGames(res.sort((a,b)=>{return b.gameprice-a.gameprice}))}setissort(!issort)});
  }
  const sortbyname = ()=>{
     fetch("http://localhost:3001/games")
     .then(d=>d.json())
     .then((res)=>{setGames(res.sort(
     function(a, b) {
          var nameA = a.gamename.toUpperCase(); 
          var nameB = b.gamename.toUpperCase(); 
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1; 
          }
          return 0; 
        }))});
  }

  return <div >
       <h1>hello world</h1>
          <form onSubmit={setdata} id="addgame">
       
               <input onChange={handlechange} name="gamename" type="text" placeholder="gamename" />

               <input onChange={handlechange} name="gameauthor" type="text" placeholder="gameauthor" />

               <input onChange={handlechange}name="gametags" type="text"  placeholder="gametags"/>

               <input onChange={handlechange}name="gameprice" type="number"  placeholder="gameprice"/>

               <input type="checkbox" onClick={handlechange}name="forkids" id=""/>

               <textarea onChange={handlechange}name="gamedesc" id="" cols="20" rows="5" placeholder="game decription"></textarea>
               
               <select onChange={handlechange}name="gamerating" id="" placeholder="rate game">
               <option value={1}>1</option>
               <option value={2}>2</option>
               <option value={3}>3</option>
               <option value={4}>4</option>
               <option value={5}>5</option>
               </select>

               <input onChange={handlechange}type="submit" value="submit"/>

               </form>
          
               <input style={{marginLeft:"80%"}} value={search} onChange={()=>{setSeaarch(search),searchbox}} id="searchbox" type="text"  placeholder="search for a game"/><br /><br />
          <table id="table">
               <thead>
                    <tr>
                         <td>game name <button id="sortbyname" onClick={sortbyname}>sort by name</button></td> 
                         <td> game author</td>
                         <td> game tags</td>
                         <td> game price  <button id="sortbyprice" onClick={sortbyprice}>sort by price</button></td>
                         <td> game is for kids</td>
                         <td> rating  <button id="sortbyrating" onClick={sortbyrating}>sort by rating</button></td>
                    </tr>
                  
               </thead>
               <tbody>

                    {games.map((g)=>{
                        return <tr className="gamerow" key={g.id}>
                              <td className="gamename">{g.gamename}</td>
                              <td>{g.gameauthor}</td>
                              <td>{g.gametags}</td>
                              <td className="gameprice">{g.gameprice}</td>
                              <td>{g.forkids?"forkids":"not for kids"}</td>
                              <td className="gamerating">{g.gamerating}</td>
                         </tr>
                    })}
               </tbody>
          </table>

  </div>;

}


/**Create a games store management in react
start with this boilerplate: https://github.com/masai-codes/Unit-5-C2 (Links to an external site.) 
There are two parts of the application
The top section shows a form id=addgame. This form has following fields:
Input name=gamename For game name eg: tetris
Input name=gameauthor for creator of games: nintendo
Input name=gametags for comma separated tags on game eg arcade, adventure
Input name=gameprice for price of game
Checkbox name=forkids to check if game is meant for younger kids
Textarea name=gamedesc for adding game of description
Select dropdown name=gamerating for rating game from 1 to 5
Input type=Submit button for submitting form
All fields must be mandatory to be filled. If any field is missing show error message
When user clicks on submit button, submit the data to your local mock json server.
Make sure to keep the jsonserver URL as http://localhost:3001/games (Links to an external site.)
Use this json as initial json in your mock server:
{
"games": [
{
"gamename": "Titanfall",
"gameauthor": "Respawn",
"gameprice": "1299",
"gametags": "FPS",
"forkids": true,
"gamedesc": "Titanfall is a series of video games that mainly feature first-person shooter games",
"gamerating": "5",
"id": 1
}]
}
Whenever user lands on the page, fetch these games from server.
Show them in a table id=table
table must follow the thead/tbody structure: <table><thead><tr>...</tr></thead> <tbody>...</tbody></table>
there are 6 columns: game name, game author, game tags, game price, is for kids, and rating
game name, game price and ratings column have `sort` button with them
clicking on this button should sort the rows by that value
use following ids for the buttons:  id="sortbyprice" for price button and  id="sortbyrating" for sort by rating button
all the rows should be sorted by game name alphabetically.
in the tbody, every row has classname gamerow
inside this row, use `gamename` class for game name column
gameprice for game price column
gamerating class for game rating column
if user clicks on this button twice then sort order should be reversed (ASC to DESC etc)
in the same component create an input field with id=searchbox 
whenever user types in this field, filter data inside table to match that game name only
eg: if I type `mar` in input field, I should only see games starting with `mar` like mario, Mars colony etc.
keep UI clean, code well commented and documented
run test cases with `npm run cypress` 
make sure to not change any single thing in `todo.spec.js` if you change anything, revert it back to it's original state. 
the test files 'hash' is calculated as `3a8aa38bef1749c2fdcc2b7105a9f0c595600e6e` any change in this file will change this hash and it will be considered as tampering with test cases.  */
