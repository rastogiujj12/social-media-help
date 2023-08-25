function handler(event) {
    // NOTE: This example function is for a viewer request event trigger. 
    // Choose viewer request for event trigger when you associate this function with a distribution. 
    var headers = {
            'cloudfront-functions': { value: 'generated-by-CloudFront-Functions' }
    }
    if(event.request.querystring && event.request.querystring.download && event.request.querystring.download.value && event.request.querystring.download.value==1)
    headers["content-disposition"]={value:`attachment; filename="${event.request.uri.slice(1).split("-collabkey-")[0]}"`}
    
    
    var response = {
        statusCode: 200,
        statusDescription: 'OK',
        headers
    };
    return response;
}