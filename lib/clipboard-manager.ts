export async function copyWithAutoClean(text: string) {
  await navigator.clipboard.writeText(text);
  setTimeout(async () => {
    try {
      const current = await navigator.clipboard.readText();
      if (current === text) {
        await navigator.clipboard.writeText('');
      }
    } catch {}
  }, 10000);
}
