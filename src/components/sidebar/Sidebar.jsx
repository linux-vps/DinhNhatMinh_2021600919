import React from "react";
import {
  HouseDoor, Person, Briefcase, FileText, Bell, Gear , 
  Calendar
} from 'react-bootstrap-icons';
import { SubmenuAccordion } from "@/components/reactdash-ui";
import Banner from "./Banner";

export default function Sidebar({ closeMobile, ...props }) {
  // Data sidebar menu (props.data)
  const sideitems = [
    {
      id: 1, 
      title: 'Bảng điều khiển', 
      url: '/admin', 
      icon: <HouseDoor />,
    },
    {
      id: 2,
      title: 'Quản lý nhân viên',
      url: '/admin/employees',
      icon: <Person />,
    },
    {
      id: 3,
      title: 'Quản lý phòng ban',
      url: '/admin/departments',
      icon: <Briefcase />,
    },
    {
      id: 4,
      title: 'Chấm công',
      url: '/admin/attendance',
      icon: <Calendar />,
    },
    {
      id: 5,
      title: 'Nghỉ phép',
      url: '/admin/leaves',
      icon: <FileText />,
    },
    {
      id: 6,
      title: 'Lương',
      url: '/admin/salaries',
      icon: <Bell />,
    },
    {
      id: 7,
      title: 'Cài đặt',
      url: '/admin/settings',
      icon: <Gear />,
      submenu: [
        { id: 7.1, title: 'Cài đặt hệ thống', url: '/admin/settings/system' },
        { id: 7.2, title: 'Cài đặt người dùng', url: '/admin/settings/user' }
      ]
    }
  ]
  // logo (props.logo)
  const logo = { img: '/img/logo.png', text: 'Reactdash' }
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

        {/* Banner */}
        <div className="px-4">
          <Banner />
        </div>
      </div>
    </nav>
  )
}