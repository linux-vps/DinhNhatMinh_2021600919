import React from 'react';
import EmployeeList from '@/components/tables/EmployeeList';
import { Preloader, Row, Column, Card } from "@/components/reactdash-ui";

const EmployeeListPage = () => {
    return (
        <Preloader>
        {/* page title  */}
        <Row>
          <Column className="w-full md:w-1/2 px-4">   
            <p className="text-xl font-bold mt-3 mb-5">Quản lý nhân viên</p>
          </Column>
        </Row>
  
        {/* content  */}
        <Row>
          <Column className="w-full px-4">
            <Card className="relative p-6">
              <EmployeeList />
            </Card>
          </Column>
        </Row>
      </Preloader>
    );
};

export default EmployeeListPage; 