import './Worker.scss';

import React, {Component} from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import WorkerTableItem from '../VacancyTableItem/WorkerTableItem';
import AddVacancyDialog from '../Dialog/AddVacancyDialog/AddVacancyDialog';
import {Icon, IconButton} from "@material-ui/core";
import UpdateVacancyDialog from "../Dialog/UpdateVacancyDialog/UpdateVacancyDialog";

const apiAddress = 'http://localhost:8080';

class App extends Component {
  state = {
    data: [],
    id: 0,
    roomData: {
      temperature: '',
      humidity: '',
      lighting: '',
      water_temperature: '',
      heat_consumption: '',
      name: ''
    },
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,

    vacancyToUpdate: null,

    showAddVacancyDialog: false,
    showUpdateVacancyDialog: false,
  };

  componentDidMount() {
    this.getAllSalaries();
  }

  componentWillUnmount() {
    // if (this.state.intervalIsSet) {
    //   clearInterval(this.state.intervalIsSet);
    //   this.setState({intervalIsSet: null});
    // }
  }

  getAllSalaries = () => {
    fetch(`${apiAddress}/api/salary`)
      .then((data) => data.json())
      .then((res) => {
        return this.setState({data: res});
      });
  };

  addSalary = (data) => axios.post('http://localhost:8080/api/salary/%7Bvacancy_id%7D', data);

  updateSalary = (vacancyId, salary) => axios.post(`${apiAddress}/api/salary/${vacancyId}`, salary);

  deleteSalary = (id) => axios.delete(`${apiAddress}/api/salary/${id}`);


  handleAddSalary = vacancy => this.addSalary(vacancy);

  handleUpdateVacancy = (salary) => this.updateSalary(salary.vacancyId, salary);

  handleDeleteVacancy = (salaryId) => this.deleteSalary(salaryId);


  handleAddVacancyDialogOpen = () => this.setState({showAddVacancyDialog: true});

  handleAddVacancyDialogClose = () => this.setState({showAddVacancyDialog: false});

  handleUpdateVacancyDialogOpen = (vacancyToUpdate) => {
    this.setState({
      showUpdateVacancyDialog: true,
      vacancyToUpdate: vacancyToUpdate
    })
  };

  handleUpdateVacancyDialogClose = () => this.setState({showUpdateVacancyDialog: false});


  renderAddVacancyDialog() {
    if (!this.state.showAddVacancyDialog) {
      return null;
    }

    return <AddVacancyDialog
      handleClose={this.handleAddVacancyDialogClose}
      handleAddVacancy={this.handleAddSalary}/>
  }

  renderUpdateVacancyDialog() {
    if (!this.state.showUpdateVacancyDialog) {
      return null;
    }

    return <UpdateVacancyDialog
      vacancy={this.state.vacancyToUpdate}
      handleClose={this.handleUpdateVacancyDialogClose}
      handleUpdateVacancy={this.handleUpdateVacancy}/>
  }

  render() {
    const {data} = this.state;
    return (
      <div className='vacancy-table'>
        <div className='title-container'>
          <h1 className='title'>Workday</h1>

          <IconButton
            className='add-vacancy-button'
            onClick={this.handleAddVacancyDialogOpen}>
            <Icon>add</Icon>
          </IconButton>
        </div>

        <Paper>
          <Table className='table'>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length <= 0
                ? ''
                : data.sort((a, b) => a.vacancyId > b.vacancyId ? 1 : -1).map(item => (
                  <WorkerTableItem
                    vacancy={item}
                    handleUpdateVacancyDialogOpen={this.handleUpdateVacancyDialogOpen}
                    handleDeleteVacancy={this.handleDeleteVacancy}/>
                ))}
            </TableBody>
          </Table>
        </Paper>

        {this.renderAddVacancyDialog()}
        {this.renderUpdateVacancyDialog()}
      </div>
    );
  }
}

export default App;