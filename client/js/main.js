// const baseUrl = "http://34.87.39.250";
const baseUrl = "http://localhost:3000";

$(document).ready(function() {
  $('#loading-page').hide();
  const token = localStorage.getItem('token');
  if (token) {
    showDashboardPage(token);
  } else {
    showLoginPage();
  }

  $('#btn-login-to-register').on('click', function() {
    $('#login-right').hide();
    $('#register-right').show();
    $('#login-left').hide();
    $('#register-left').show();
  })

  $('#btn-register-to-login').on('click', function() {
    $('#login-right').show();
    $('#register-right').hide();
    $('#login-left').show();
    $('#register-left').hide();
  })

  $('#btn-login').on('click', () => {
    const email = $('input[name="loginEmail"]').val();
    const password = $('input[name="loginPassword"]').val();
    $('#loading-page').show();
    $.ajax({
      method: "POST",
      url: `${baseUrl}/user`,
      data: { email, password }
    })
    .done(function(res) {
      $('#loading-page').hide();
      localStorage.setItem('token', res.token);
      showDashboardPage(res.token);
    })
    .fail(function(req, status, err) {
      $('#loading-page').hide();
      if (status === 'error') {
        console.log(req, status, err);
      }
      failAlert('Wrong username / password!');
    })
  })

  $('#logout').on('click', function() {
    Swal.fire({
      title: 'Logout? :(',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        successAlert('Bye :)');
        setTimeout(() => {
          signOut();
          localStorage.clear();
        }, 1000);
      }
    })
  })

  $('#change-img-profile').on('click', function() {
    $('#loading-page').show();
    const pic = new FormData($('#fileUploadForm')[0]);
    $.ajax({
      type: "POST",
      enctype: 'multipart/form-data',
      url: `${baseUrl}/user/image/${localStorage.getItem('token')}`,
      data: pic,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 600000,
    })
    .done(function(res) {
      $('#loading-page').hide();
      $('#profile-img-box img').attr('src', res.url);
      console.log(res.url);
      $('input[name=image]').val('');
    })
    .fail(function() {
      $('#loading-page').hide();
      console.log('Gagal');
    })
  })

  $('#done-task').on('click', function() {
    const todo_id = $('#done-task').attr('todo-id');

    Swal.fire({
      title: 'Have done?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sure!'
    })
    .then(function(result) {
      if (result.value) {
        $('#loading-page').show();
        $.ajax({
          method: "GET",
          url: `${baseUrl}/todo/done/${todo_id}/${token}`
        })
        .done(function() {
          $('#loading-page').hide();
          successAlert('Congratulation!');
          $(`.card[obj-id=${todo_id}] i`).attr('class', 'fas fa-check-circle fa-2x');
          $(`#status-detail i`).attr('class', 'fas fa-check-circle fa-2x');
          $('#done-task').attr("disabled", true);
          console.log($(`.card[obj-id=${todo_id}] i`));
          let completeTask = $('#completed-task h2').html();
          $('#completed-task h2').html(+completeTask + 1);
          let todoTask = $('#todo-task h2').html();
          $('#todo-task h2').html(+todoTask - 1);
        })
        .fail(function(err) {
          $('#loading-page').hide();
          console.log(err);
        })
      }
    })
  })

  $('#btn-register').on('click', function() {
    let username = $('input[name=registerUsername]').val();
    let email = $('input[name=registerEmail]').val();
    let password = $('input[name=registerPassword]').val();
    $('#loading-page').show();
    $.ajax({
      method: 'POST',
      url: `${baseUrl}/user/register`,
      data: {username, email, password}
    })
    .done(function(data) {
      $('#loading-page').hide();
      // localStorage.setItem('token', data.token);
      // showDashboardPage(token);
      username = $('input[name=registerUsername]').val('');
      email = $('input[name=registerEmail]').val('');
      password = $('input[name=registerPassword]').val('');
      successAlert('Success please Login');
    })
    .fail(function(err) {
      $('#loading-page').hide();
      failAlert('Invalid Input! :(');
    })
  })

  $('#box-edit-icon').on('click', function() {
    let todo = $('#title-todo').text();
    let desc = $('#description-detail').text();
    let due_date = $('#date-detail').text();
    let year = new Date(due_date).getFullYear();
    let month = new Date(due_date).getMonth();
    let date = new Date(due_date).getDate();
    // console.log(year, month, date);
    let dateStr = `${year}-${date}-${month}`;
    // console.log(dateStr);
    $('#edit-todo').val(todo);
    $('#edit-desc').val(desc);
    $('#edit-date').val(dateStr);
    $('#edit-date').attr('value', dateStr);
    $('#edit').attr('todo-id', $(this).attr('todo-id'));
  })
  
  $('#edit').on('click', function() {
    let todoEdit = $('#edit-todo').val();
    let descEdit = $('#edit-desc').val();
    let dateEdit = $('#edit-date').val();
    let todo_id = $(this).attr('todo-id');
    console.log(todoEdit, descEdit, dateEdit);

    $.ajax({
      method: "post",
      url: `${baseUrl}/todo/update/${todo_id}/${localStorage.getItem('token')}`,
      data: { todoEdit, descEdit, dateEdit }
    })
    .done(function(data) {
      $(`.card[obj-id=${todo_id}] .title-task`).text(todoEdit);
      $(`.card[obj-id=${todo_id}] .date-task`).text(Date(dateEdit));
      successAlert('Updated!');
    })
    .fail(function(err) {
      console.log(err);
    })
  })
})