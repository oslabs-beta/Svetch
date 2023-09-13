// eslint-disable-next-line import/prefer-default-export
export async function POST({ request }) {
  const { blobs } = await request.json();

  const createTreeStructure = async (blobArray) =>
    blobArray.map(({ path, sha }) => ({
      path,
      mode: '100644',
      type: 'blob',
      sha
    }));

  const tree = await createTreeStructure(blobs);
  return new Response(JSON.stringify({ tree }));
}
