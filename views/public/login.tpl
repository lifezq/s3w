<%= header %>

   <link href="../../s3w/css/signin.css" rel="stylesheet">

    <div class="container">

    <form class="form-signin" action="/s3w/login" method="post"  enctype="multipart/form-data">
        <h2 class="form-signin-heading">Please sign in</h2>
        <label for="inputEmail" class="sr-only">Email address</label>
        <input type="email" id="inputEmail" class="form-control" placeholder="Email address" name="s3-email" required="" autofocus="">
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" name="s3-password" required="">

        <div class="alert alert-danger hidden">
            <p class="alert-msg">&nbsp;&nbsp;</p>
        </div>
        <div class="checkbox">
          <label>
            <input type="checkbox" value="remember-me"> Remember me
          </label>

        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit" onClick="return s3.Login();">Sign in</button>
      </form>

    </div>

<%= footer %>
