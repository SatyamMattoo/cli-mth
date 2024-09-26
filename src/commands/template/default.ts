export const defaultHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
  </head>
  <body>
    <div id="content">{{content}}</div>
    <script>{{script}}</script>
  </body>
</html>`;

export const fullHTML: string = `
<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Directory Listing</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #e9ecef;
          color: #343a40;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          flex-direction: column;
        }
        h3 {
          color: #495057;
          margin-bottom: 20px;
        }
        ul {
          list-style-type: none;
          padding: 0;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          width: 80%;
          max-width: 600px;
          text-align: left;
        }
        li {
          margin: 10px 0;
          padding: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        li:last-child {
          border-bottom: none;
        }
        div{
        width: 100%;
        display: flex;
        justify-content: center;
        }
        a {
          text-decoration: none;
          color: #007bff;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
          color: #0056b3;
        }
        strong {
          color: #343a40;
        }
      </style>
    </head>
    <body>
      <h3>Available Files</h3>
      {{listing}}
    </body>
    </html>
`;