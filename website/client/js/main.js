$.ajax({
  url: "http://localhost:3003/api/users",
  method: "GET",
  data: JSON.stringify({
    a: "a",
    b: "b"
  })
}).then(res => {
  // debugger;
  console.log(1);
}).catch(err => {
  console.log(2);
});