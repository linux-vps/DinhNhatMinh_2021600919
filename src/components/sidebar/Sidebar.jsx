import React from "react";
import { Link } from "react-router-dom";
import { HouseDoor } from 'react-bootstrap-icons';
import { FiUsers, FiBriefcase } from 'react-icons/fi';
import { SubmenuAccordion } from "@/components/reactdash-ui";


export default function Sidebar({ closeMobile, ...props }) {
  // Data sidebar menu (props.data)
  const sideitems = [
    {
      id: 1, title: 'Dashboards', url: '/dashboard/', icon: <HouseDoor />,
      
    },
    {
      id: 3, title: 'Quản lý nhân viên', url: '/employees/', icon: <FiUsers />,
      
    },
    {
      id: 4, title: 'Quản lý phòng ban', url: '/departments/', icon: <FiBriefcase />,
      
    }
 
  ]
  // logo (props.logo)
  const logo = { img: '/img/logo.png', text: 'HRM System' }
  const models = {
    "compact": "sidebar-compact w-0 md:w-20",
    "default": "sidebar-area w-64"
  }
  const colors = {
    "dark": "dark",
    "light": "light"
  }
  const addmodel = props.model ? models[props.model] : 'sidebar-area w-64';
  const addcolor = props.color ? colors[props.color] : '';
  const addClass = props.className ? `${props.className} ` : '';

  return (
    <nav id="sidebar-menu" className={`${addClass}fixed ${addmodel} ${addcolor} transition-all duration-500 ease-in-out h-screen shadow-sm`}>
      <div className="h-full bg-white dark:bg-gray-800 overflow-y-auto scrollbars">
        {/* logo */}
        {logo ?
          <div className="mh-18 text-center py-5">
            <h2 className="text-2xl font-semibold text-gray-200 px-4 max-h-9 overflow-hidden hidden-compact">
              <img className="inline-block w-8 h-8 ltr:mr-2 rtl:ml-2 -mt-1" src={logo.img} />
              <span className="text-gray-700 dark:text-gray-200">{logo.text}</span>
            </h2>
            <h2 className="text-3xl font-semibold mx-auto logo-compact hidden">
              <img className="inline-block w-8 h-8 -mt-1" src={logo.img} />
            </h2>
          </div>
          : ''}

        {/* sidebar menu */}
        <ul id="side-menu" className="w-full float-none flex flex-col font-medium ltr:pl-1.5 rtl:pr-1.5">
          <SubmenuAccordion data={sideitems} closeMobile={closeMobile} />
        </ul>


      </div>
    </nav>
  )
}