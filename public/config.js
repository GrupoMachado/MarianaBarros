;(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.APP_CONFIG = factory()
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return {
    SUPABASE_URL: 'https://wutjxjubudszwgvxedgm.supabase.co',
    SUPABASE_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGp4anVidWRzendndnhlZGdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTE0Njg2NiwiZXhwIjoyMDkwNzIyODY2fQ.w4ZbytunBRStZXYCt-AkrPd23djPVFwe1ppTNG8HsiY',
  }
})

