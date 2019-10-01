const router = require('express').Router();
const TodoController = require('../controllers/todo');

router.post('/', TodoController.createTodo);
router.get('/:token', TodoController.showDashboard);
router.get('/detail/:id', TodoController.findOne);
router.delete('/:todo_id/:token', TodoController.delete);
router.get('/done/:todo_id/:token' , TodoController.doneTodo);
router.post('/update/:todo_id/:token' , TodoController.updateTodo);

module.exports = router;