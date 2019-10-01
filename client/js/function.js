function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  showLoginPage();
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  const token = localStorage.getItem('token');

  if (!token) {
    $('#loading-page').show();
    $.ajax({
      method: "POST",
      url: `${baseUrl}/user/google`,
      data: { id_token }
    })
    .done(function(res) {
      $('#loading-page').hide();
      console.log('okee', res);
      localStorage.setItem('token', res.token);
      showDashboardPage(token);
    })
    .fail(function(err) {
      $('#loading-page').hide();
      console.log(err, '<<<<<<<<<<<<<<<<< error on signin');
    })
  }
}

function showLoginPage() {
  $('#login-register').show();
  $('#dashboard').hide();
  $('#register-right').hide();
  $('#register-left').hide();
}

function prependCard(data) {
  let icon = '';
  if (data.status === true) {
    icon = 'fas fa-check-circle';
  } else {
    icon = 'far fa-times-circle';
  }
  const html = `
  <div class="card blue-bg" obj-id="${data._id}">
    <div class="card-body">
      <i class="${icon} fa-2x"></i>
      <div class="title-desc-task">
        <div class="title-task">${data.todo}</div>
        <div class="date-task">${Date(data.due_date)}</div>
      </div>
    </div>
  </div>`
  $('#box-list-task').prepend(html);
}

function getProfile(token) {
  $('#loading-page').show();
  $.ajax({
    method: "GET",
    url: `${baseUrl}/user/${token}`
  })
  .done(function(res) {
    // console.log(res);
    $('#loading-page').hide();
    $('#profile-img-box img').attr('src', res.profile_pic);
    $('#box-img-option-task img').attr('src', res.profile_pic);
    $('#name h4').text(res.full_name);
    console.log($('#profile-option-task #box-img-option-task h5').text());
    $('#box-img-option-task h5').text(res.full_name);
    $('#email p').text(res.email);
  })
  .fail(err => {
    $('#loading-page').hide();
    console.log(err);
  })
}

function showDashboardPage(token) {
  $('#login-register').hide();
  $('#dashboard').show();
  getProfile(token);

  $('#body-detail').hide();
  $('#done-task').hide();
  $('#box-edit-icon').hide();
  $('#box-delete-icon').hide();

  $('#add-task').on('click', function() {
    addTodo();
    let uncomplete = $('#todo-task h2').text();
    let all = $('#all-todo-task h2').text();
    $('#todo-task h2').text(+uncomplete + 1);
    $('#all-todo-task h2').text(+all + 1);
  })

  $('#loading-page').show();

  $.ajax({
    method: "GET",
    url: `${baseUrl}/todo/${token}`
  })
  .done(function(data) {
    $('#loading-page').hide();
    let completed = 0;
    let uncomplete = 0;
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      prependCard(data[i]);
      if (data[i].status === true) {
        completed += 1;
      } else {
        uncomplete += 1;
      }
    }
    $('#completed-task h2').text(completed);
    $('#todo-task h2').text(uncomplete);
    $('#all-todo-task h2').text(completed + uncomplete);
    console.log(completed, uncomplete);
    cardClick();
    
    $('#box-delete-icon').on('click', function() {
      const todo_id = $('#box-delete-icon').attr('todo-id');
      deleteTodo(todo_id, localStorage.getItem('token'));
    })
  })
  .fail(function(err) {
    $('#loading-page').hide();
    console.log(err);
  })
}

function cardClick() {
  $('.card').on('click', function() {
    const id = $(this).attr('obj-id');
    showDetailTodo(id);
  })
}

function showDetailTodo(id) {
  $('#loading-page').show();
  $.ajax({
    method: "GET",
    url: `${baseUrl}/todo/detail/${id}`
  })
  .done(function(data) {
    $('#loading-page').hide();
    $('#body-detail').show();
    if (data.status === true) {
      $('#status-detail').html('<i class="fas fa-check-circle fa-2x"></i>');
      $('#done-task').attr("disabled", true);
    } else {
      $('#status-detail').html('<i class="far fa-times-circle fa-2x"></i>');
      $('#done-task').attr("disabled", false);
    }
    $('#title-todo').html(data.todo);
    $('#date-detail').html(`<i class="far fa-clock"></i> ${Date(data.createdAt)}`)
    $('#description-detail').html(data.desc);

    $('#box-edit-icon').show();
    $('#box-delete-icon').show();

    $('#box-edit-icon').attr('todo-id', data._id);
    $('#box-delete-icon').attr('todo-id', data._id);

    $('#done-task').show();
    $('#done-task').attr('todo-id', data._id);
  })
  .fail(function(err) {
    $('#loading-page').hide();
    console.log(err);
  })
}

function addTodo() {
  let todo = $('#create-todo').val();
  let desc = $('#create-desc').val();
  let due_date = $('#create-date').val();
  $('#loading-page').show();
  $.ajax({
    method: "POST",
    url: `${baseUrl}/todo`,
    data: {
      todo,
      desc,
      due_date,
      token: localStorage.getItem('token')
    }
  })
  .done(function(data) {
    $('#loading-page').hide();
    prependCard(data);
    cardClick();
    successAlert('Your todo has been saved');
    $('#create-todo').val('');
    $('#create-desc').val('');
    $('#create-date').val('');
  })
  .fail(function(err) {
    $('#loading-page').hide();
    failAlert('Data not valid :(');
    console.log(err);
  })
}

function deleteTodo(todo_id, token) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      $('#loading-page').show();
      $.ajax({
        method: "DELETE",
        url: `${baseUrl}/todo/${todo_id}/${token}`
      })
      .done(function(res) {
        $('#loading-page').hide();
        const el = $(`.card[obj-id=${todo_id}]`);
        el.remove();
        $('#body-detail').hide();
        $('#done-task').hide();
        $('#box-edit-icon').hide();
        $('#box-delete-icon').hide();
        successAlert('Your todo has been deleted')
      })
      .fail(function(err) {
        $('#loading-page').hide();
        console.log(err);
      })
    }
  })
}

function successAlert(str) {
  Swal.fire({
    type: 'success',
    title: str,
    showConfirmButton: false,
    timer: 1000
  })
}

function failAlert(str) {
  Swal.fire({
    type: 'error',
    title: str,
  })
}