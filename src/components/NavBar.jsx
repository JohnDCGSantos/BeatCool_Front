import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <>
      <ul className='navBar'>
        <li>
          <NavLink to='/'> Create </NavLink>
        </li>
        <li>
          <NavLink to='/combinedCreator'>Create Combined</NavLink>
        </li>
        <li>
          <NavLink to='/drumkits'>DrumKit List</NavLink>
        </li>
        <li>
          <NavLink to='/beatCreator'>BeatCreator List</NavLink>
        </li>
        <li>
          <NavLink to='/combined'>Combined List</NavLink>
        </li>
      </ul>
    </>
  )
}

export default Navbar
