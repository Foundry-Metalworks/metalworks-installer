function formToJson() {
  const array = $('form').serializeArray(); // Encodes the set of form elements as an array of names and values.
  const json = {};
  $.each(array, function () {
    json[this.name] = this.value || '';
  });
  return json;
}
function submitUploadData(data) {
  return $.ajax('api/v1/setup', {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: (data) => {
      $('#error').text('');
      $('#success').text('Redirecting to FoundryVTT...');
      $('#pending').text('');
      setTimeout(() => window.location.assign(data), 7000);
    },
    error: ({ responseJSON: { error } }) => {
      $('#success').text('');
      $('#pending').text('');
      $('#error').text(`Error: ${JSON.stringify(error)}`);
    },
  });
}
$(document).ready(function () {
  $('form').submit(function (e) {
    e.preventDefault();
    const data = formToJson();
    submitUploadData(data);

    $('#error').text('');
    $('#success').text('');
    $('#pending').text('FoundryVTT install in progress. This may take a minute...');
  });
});
