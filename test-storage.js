// Test script to verify Supabase Storage setup
// Run this in your browser console to test storage functionality

const SUPABASE_URL = 'https://gzwztlnwiyaeqqpamkde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6d3p0bG53aXlhZXFxcGFta2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MjYxODEsImV4cCI6MjA3NTMwMjE4MX0.25jJKzcn1FU4rkI93183dtyPjr0D126ej-B4OYRSJu8';

// Import Supabase client (if running in browser)
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testStorage() {
  console.log('🧪 Testing Supabase Storage...');
  
  try {
    // Test 1: Check if we can list buckets
    console.log('1. Testing bucket listing...');
    const { data: buckets, error: bucketsError } = await supabaseClient.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
      return false;
    }
    
    console.log('✅ Buckets listed successfully:', buckets);
    
    // Test 2: Check if driver-documents bucket exists
    console.log('2. Checking for driver-documents bucket...');
    const driverBucket = buckets?.find(bucket => bucket.name === 'driver-documents');
    
    if (!driverBucket) {
      console.error('❌ driver-documents bucket not found');
      console.log('Available buckets:', buckets?.map(b => b.name));
      return false;
    }
    
    console.log('✅ driver-documents bucket found:', driverBucket);
    
    // Test 3: Test bucket access
    console.log('3. Testing bucket access...');
    const { data: files, error: filesError } = await supabaseClient.storage
      .from('driver-documents')
      .list('', { limit: 1 });
    
    if (filesError) {
      console.error('❌ Error accessing bucket:', filesError);
      return false;
    }
    
    console.log('✅ Bucket access successful, files:', files);
    
    // Test 4: Test file upload (with a small test file)
    console.log('4. Testing file upload...');
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const testPath = `test/${Date.now()}_test.txt`;
    
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('driver-documents')
      .upload(testPath, testFile);
    
    if (uploadError) {
      console.error('❌ Error uploading test file:', uploadError);
      return false;
    }
    
    console.log('✅ Test file uploaded successfully:', uploadData);
    
    // Test 5: Get public URL
    console.log('5. Testing public URL generation...');
    const { data: { publicUrl } } = supabaseClient.storage
      .from('driver-documents')
      .getPublicUrl(testPath);
    
    console.log('✅ Public URL generated:', publicUrl);
    
    // Test 6: Clean up test file
    console.log('6. Cleaning up test file...');
    const { error: deleteError } = await supabaseClient.storage
      .from('driver-documents')
      .remove([testPath]);
    
    if (deleteError) {
      console.warn('⚠️ Warning: Could not delete test file:', deleteError);
    } else {
      console.log('✅ Test file cleaned up successfully');
    }
    
    console.log('🎉 All storage tests passed! Your Supabase Storage is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Storage test failed with error:', error);
    return false;
  }
}

// Run the test
testStorage().then(success => {
  if (success) {
    console.log('✅ Storage is ready for use!');
  } else {
    console.log('❌ Storage setup needs attention. Check the errors above.');
  }
});
