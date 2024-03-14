function formToJson() {
  const array = $('form').serializeArray(); // Encodes the set of form elements as an array of names and values.
  const json = {};
  $.each(array, function () {
    json[this.name] = this.value || '';
  });
  return json;
}
function submitUploadData(data) {
  return $.ajax('api/v1/upload', {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: (data) => {
      window.location.href = data;
    },
    error: () => {
      $('span').removeClass('text-accent');
      $('span').addClass('text-secondary');
      $('span').text('Failed to install FoundryVTT');
    },
  });
}
$(document).ready(function () {
  $('form').submit(function (e) {
    e.preventDefault();
    const data = formToJson();
    submitUploadData(data);
    $('span').removeClass('text-secondary');
    $('span').addClass('text-accent');
    $('span').text('FoundryVTT install in progress. This may take a minute...');
  });
});
