# GhostChat Coding Standards

## Character Encoding Rules

### No Unicode or Emoji in Code
- **NEVER** use unicode characters or emoji in any source code files (.ts, .tsx, .js, .jsx, .json, etc.)
- Use only ASCII characters in code
- Emoji and unicode are **ONLY** allowed in markdown (.md) documentation files
- Use descriptive ASCII text instead of symbols

**Examples:**

Bad (code files):
```typescript
const status = '...'; // NO emoji
const arrow = '->'; // NO unicode arrow
const message = 'Loading...'; // NO unicode ellipsis
```

Good (code files):
```typescript
const status = 'success'; // ASCII only
const arrow = '->'; // ASCII arrow
const message = 'Loading...'; // ASCII ellipsis
```

Allowed (markdown files only):
```markdown
## Features
- Privacy-first
- P2P connections
```

## Command Execution

### Always Execute Commands
- When commands are suggested or needed, **ALWAYS** execute them immediately
- Do not just suggest commands - run them using executeBash tool
- Verify command results before proceeding to next steps

## Development Workflow

### Test-Driven Development (TDD)
- **NEVER** add features directly to existing components
- **ALWAYS** create new features in isolated files first
- Write tests for the isolated module before integration
- Only integrate after tests pass successfully

**Process:**
1. Create new feature in dedicated file (e.g., `lib/file-sharing.ts`)
2. Write unit tests in `tests/` directory
3. Run tests and verify they pass
4. Only then integrate into existing components

**Example:**
```typescript
// Bad: Adding file sharing directly to ChatCore.tsx
// Good: Create lib/file-sharing.ts -> test it -> integrate
```

## Code Style

### Minimal Implementation
- Write only the absolute minimal code needed
- Avoid verbose implementations
- Remove any code that doesn't directly contribute to the solution
- Prefer concise, readable code over over-engineered solutions

### TypeScript Standards
- Use strict TypeScript types
- Avoid `any` types unless absolutely necessary
- Prefer interfaces over types for object shapes
- Use const assertions where appropriate

### React/Next.js Standards
- Use functional components only
- Prefer hooks over class components
- Use Server Components by default, Client Components only when needed
- Keep components small and focused

### Privacy & Security
- Never log sensitive data
- Use memory-only storage (no localStorage/IndexedDB for messages)
- Implement auto-clear on tab close
- Follow zero-trust principles

## File Naming

- Use kebab-case for files: `chat-core.tsx`, `webrtc-manager.ts`
- Use PascalCase for React components: `ChatCore`, `InviteHub`
- Use camelCase for functions and variables: `connectToPeer`, `messageCount`

## Comments

- Minimize comments by writing self-documenting code
- Only add comments for complex logic or non-obvious decisions
- No ASCII art or decorative comments
- No emoji or unicode in comments
