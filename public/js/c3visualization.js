(function() {
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      
      console.log(data);
      
      
   
      var mediaCounts = data.users.map(function(item){
        // console.log(item);
        return item.counts.media;
      });
      
      var usernames = data.users.map(function(item){
         return item.username;
      });

      console.log(usernames);
      var followed_by= data.users.map(function(item){
        // console.log(item);
        return item.counts.followed_by;
      });
      // console.log(followed_by);
      var follows = data.users.map(function(item){
        // console.log(item);
        return item.counts.follows;
      });
      console.log(followed_by);
      console.log(follows);
   
      mediaCounts.unshift('Media Count');
      followed_by.unshift('Followed by');
      follows.unshift('Follows');

      console.log("mediaCounts length: "+ mediaCounts.length);
      console.log("followed_by length: "+ followed_by.length);
      console.log("follows length: "+ follows.length);
     

      var chart = c3.generate({
        bindto: '#chart',
        data: {
         
          columns: [
          
             mediaCounts,
             follows,
             followed_by
          // ["Follows",follows]
          ]
        }
      });

    });
})();
