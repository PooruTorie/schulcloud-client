import { browserHistory } from 'react-router';
import {render} from 'react-dom';
import {compose} from 'react-komposer';
import { SubsManager } from 'feathers-subscriptions-manager';

import adminActions from '../../administration/actions/administration';

import component from '../components/signup';
import actions from '../actions/signup';

const schoolService = Server.service('/schools');
const courseService = Server.service('/courses');
const classService = Server.service('/classes');
const userService = Server.service('/users');
const roleService = Server.service('/roles');

import { Server } from '../../core/helpers';

const pluckArrayToObject = (array, key) => {
	const result = {};
	array.forEach((obj) => {
		result[obj[key]] = obj;
	});
	return result;
};


function composer(props, onData) {
	if(!Server.get('user')) {
		console.error('User has to be logged in at this point');
	} else {
		const currentUser = Server.get('user');
		if((currentUser.system || {}).finishedSignup) {
			browserHistory.push('/dashboard/');
			return;
		}

		const subsManager = new SubsManager();

		const schoolId = '584ad186816abba584714c94';

		subsManager.addSubscription(schoolService.get(schoolId), 'school');

		subsManager.addSubscription(courseService.find({query: {schoolId: schoolId}}), (courses) => {
			return {courses: courses.data, coursesById: pluckArrayToObject(courses.data, '_id')};
		});

		subsManager.addSubscription(classService.find({query: {schoolId: schoolId}}), (classes) => {
			return {classes: classes.data, classesById: pluckArrayToObject(classes.data, '_id')};
		});

		subsManager.addSubscription(userService.find({
			query: {
				roles: ['teacher'],
				$populate: ['roles']
			},
			rx: {
				listStrategy: 'always',
				idField: '_id',
				matcher: query => item => {
					// TODO: this should work out of the box - looks like a bug in the feathers-reactive module
					return roleService.find({
						query: {
							_id: {
								$in: item.roles || []
							}
						}
					}).then((response) => {
						return response.data.map(r => r.name).includes('teacher');
					});
				}
			}
		}), (teachers) => {
			return {teachers: teachers.data, teachersById: pluckArrayToObject(teachers.data, '_id')};
		});

		subsManager.ready((data, initial) => {
			const combinedActions = Object.assign({}, adminActions, actions);
			const componentData = Object.assign({
				actions: combinedActions,
				step: props.params.step,
				onSignupFinished: () => {
					actions.finishSignup(currentUser._id).then(() => {
						browserHistory.push("/administration/");
					});
				}
			}, data);

			onData(null, componentData);
		});



	}
}

export default compose(composer)(component);
